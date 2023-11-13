import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import {
  CheckBadgeIcon,
  CloudArrowDownIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios, { type AxiosRequestConfig } from "axios";
import { useTranslations } from "next-intl";

import { BG_TRANSPARENT_BACKDROP, SHADOW } from "~/config/design";
import { Button, Loading } from "~/components/shared";
import { api } from "~/utils/api";
import type { ImageUploadApiResponse } from "~/types/index";
import { useMessage } from "~/utils/store";

/* eslint-disable @next/next/no-img-element */
export const EditProfilePicture = ({
  field,
  value,
}: {
  field: string;
  value: string;
}) => {
  const [edit, setEdit] = useState(false);
  const [newPicType, setNewPicType] = useState<
    "generate" | "upload" | undefined
  >();
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { setTimedMessage } = useMessage();

  // RANDOM STRING FOR DICEBEAR AVATAR
  const generateRandomString = (length: number) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  // UPLOAD NEW PROFILE PICTURE
  const [image, setImage] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      const i = event?.target?.files[0];
      setImage(i);
      setNewValue(URL.createObjectURL(i));
    }
  };

  const editMutation = api.account.edit.useMutation();
  const utils = api.useContext();

  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();
    if (newPicType === "generate" && newValue) {
      setLoading(true);
      await editMutation.mutateAsync(
        { field: "picture", value: newValue },
        {
          onSettled(data, error) {
            if (error)
              setTimedMessage({
                type: "error",
                text: error.message ?? "",
                duration: 3000,
              });
            if (data) {
              if (data.success) {
                setTimedMessage({
                  type: "success",
                  text: data.message ?? "",
                  duration: 3000,
                });
                void utils.account.profile.invalidate();
              } else
                setTimedMessage({
                  type: "error",
                  text: data.error ?? "",
                  duration: 3000,
                });
            }
          },
        },
      );
    } else if (newPicType === "upload" && newValue && image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("folder", "pp");
      formData.append("public_id", new Date().getTime().toString());
      const config: AxiosRequestConfig = {
        headers: { "content-type": "multipart/form-data" },
        onUploadProgress: (event) => {
          setProgress(Math.round((event.loaded * 100) / (event.total ?? 1)));
        },
      };
      const { data } = await axios.post<ImageUploadApiResponse>(
        "/api/uploads/image",
        formData,
        config,
      );
      if (data.success) {
        setProgress(0);
        setLoading(true);
        await editMutation.mutateAsync(
          { field: "picture", value: data.url },
          {
            onSettled(data, error) {
              if (error)
                setTimedMessage({
                  type: "error",
                  text: error.message ?? "",
                  duration: 3000,
                });
              if (data) {
                if (data.success) {
                  setTimedMessage({
                    type: "success",
                    text: data.message ?? "",
                    duration: 3000,
                  });
                  void utils.account.profile.invalidate();
                } else
                  setTimedMessage({
                    type: "error",
                    text: data.error ?? "",
                    duration: 3000,
                  });
              }
            },
          },
        );
      } else {
        setTimedMessage({
          type: "error",
          text: data.message ?? "",
          duration: 3000,
        });
      }
    }
    setEdit(false);
    setLoading(false);
  };

  const t = useTranslations("AccountPage.details");

  return (
    <>
      {loading && (
        <span className="font-mono text-sm">
          <Loading size="small" /> {t("loading")}...
        </span>
      )}
      {progress !== 0 && (
        <div
          className={` ${BG_TRANSPARENT_BACKDROP} mx-auto mt-4 h-2.5 max-w-md rounded-full `}
        >
          <div
            className="h-2.5 rounded-full bg-aliexpress"
            style={{ width: progress + "%" }}
          />
        </div>
      )}
      {edit ? (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form onSubmit={submitHandler}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {!newPicType && (
                <div className="font-mono">{t("profilePicture.desc")}</div>
              )}
              <div className="truncate">
                <img
                  src={newValue}
                  alt="generated profile picture"
                  className={`m-1 h-32 w-32 truncate rounded-full ${SHADOW}`}
                />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setNewPicType("upload");
                    setNewValue("");
                  }}
                  variant="solid"
                  type="button"
                  icon={
                    newPicType === "upload" && (
                      <CheckBadgeIcon
                        className="mr-1 inline h-6 w-6"
                        aria-hidden="true"
                      />
                    )
                  }
                >
                  {t("profilePicture.upload")}
                </Button>
                <input
                  accept="image/*"
                  name={"upload_profile_picture"}
                  onChange={onChangeHandler}
                  ref={fileInputRef}
                  maxLength={1}
                  style={{ display: "none" }}
                  type="file"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setNewPicType("generate");
                    setNewValue(
                      `https://avatars.dicebear.com/api/bottts/${generateRandomString(
                        6,
                      )}.svg`,
                    );
                  }}
                  variant="solid"
                  type="button"
                  icon={
                    newPicType === "generate" && (
                      <CheckBadgeIcon
                        className="mr-1 inline h-6 w-6"
                        aria-hidden="true"
                      />
                    )
                  }
                >
                  {t("profilePicture.generate")}
                </Button>
              </div>
            </div>
          </div>
          <div>
            <Button
              variant="outline"
              icon={
                <XMarkIcon className="mr-2 inline h-5 w-5" aria-hidden="true" />
              }
              onClick={() => setEdit(false)}
              type="button"
            >
              {t("cancel")}
            </Button>
          </div>
          <div>
            <Button
              variant="outline"
              icon={
                <CloudArrowDownIcon
                  className="mr-2 inline h-5 w-5"
                  aria-hidden="true"
                />
              }
              type="submit"
            >
              {t("save")} {field}
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div>
            <img
              src={value}
              className={`h-32 w-32 rounded-full ${SHADOW}`}
              alt="profile picture"
            />
          </div>
          <Button
            variant="outline"
            icon={
              <PencilIcon className="mr-2 inline h-5 w-5" aria-hidden="true" />
            }
            onClick={() => setEdit(true)}
          >
            {t("edit")} {field}
          </Button>
        </>
      )}
    </>
  );
};
