import { ChangeEvent, FormEvent, useRef, useState } from "react";
import {
  CheckBadgeIcon,
  CloudArrowDownIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios, { AxiosRequestConfig } from "axios";
import { useTranslations } from "next-intl";

import { BG_TRANSPARENT_BACKDROP, SHADOW } from "@config/design";
import Button from "@components/shared/Button";
import Banner from "@components/shared/Banner";
import Loading from "@components/shared/Loading";
import { trpc } from "@utils/trpc";
import { IMessage } from "@reglini-types/index";

/* eslint-disable @next/next/no-img-element */
const EditProfilePicture = ({
  field,
  value,
}: {
  field: string;
  value: any;
}) => {
  const [edit, setEdit] = useState(false);
  const [newPicType, setNewPicType] = useState<
    "generate" | "upload" | undefined
  >();
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<IMessage>();

  // RANDOM STRING FOR DICEBEAR AVATAR
  const generateRandomString = (length: number) => {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  // UPLOAD NEW PROFILE PICTURE
  const [image, setImage] = useState<any>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onChangeHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setNewValue(URL.createObjectURL(i));
    }
  };

  const editMutation = trpc.account.edit.useMutation();
  const utils = trpc.useContext();
  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();
    if (newPicType === "generate" && newValue) {
      setLoading(true);
      await editMutation.mutateAsync(
        { field: "picture", value: newValue },
        {
          onSettled(data, error) {
            if (error) setMessage({ type: "error", text: error.message });
            if (data) {
              if (data.success) {
                setMessage({ type: "success", text: data.message });
                utils.account.profile.invalidate();
              } else setMessage({ type: "error", text: data.error });
            }
            setTimeout(() => {
              setMessage({ type: undefined, text: undefined });
            }, 3000);
          },
        }
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
      const { data } = await axios.post("/api/uploads/image", formData, config);
      if (data.success) {
        setProgress(0);
        setLoading(true);
        await editMutation.mutateAsync(
          { field: "picture", value: data.url },
          {
            onSettled(data, error) {
              if (error) setMessage({ type: "error", text: error.message });
              if (data) {
                if (data.success) {
                  setMessage({ type: "success", text: data.message });
                  utils.account.profile.invalidate();
                } else setMessage({ type: "error", text: data.error });
              }
              setTimeout(() => {
                setMessage({ type: undefined, text: undefined });
              }, 3000);
            },
          }
        );
      } else {
        setMessage({ type: "error", text: data.message });
      }
    }
    setEdit(false);
    setLoading(false);
  };

  const t = useTranslations("AccountPage.details");

  return (
    <>
      {message?.type && <Banner type={message?.type} message={message?.text} />}
      {loading && (
        <span className="font-mono text-sm">
          <Loading size="small" /> {t("loading")}...
        </span>
      )}
      {progress !== 0 && (
        <div
          className={` ${BG_TRANSPARENT_BACKDROP} mx-auto max-w-md rounded-full h-2.5 mt-4 `}
        >
          <div
            className="bg-aliexpress h-2.5 rounded-full"
            style={{ width: progress + "%" }}
          />
        </div>
      )}
      {edit ? (
        <form onSubmit={submitHandler}>
          <div className="flex justify-between items-center">
            <div className="flex-1">
              {!newPicType && (
                <div className="font-mono">{t("profilePicture.desc")}</div>
              )}
              <div className="truncate">
                <img
                  src={newValue}
                  alt="generated profile picture"
                  className={`m-1 h-32 w-32 rounded-full truncate ${SHADOW}`}
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
                        className="h-6 w-6 inline mr-1"
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
                        6
                      )}.svg`
                    );
                  }}
                  variant="solid"
                  type="button"
                  icon={
                    newPicType === "generate" && (
                      <CheckBadgeIcon
                        className="h-6 w-6 inline mr-1"
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
                <XMarkIcon className="inline h-5 w-5 mr-2" aria-hidden="true" />
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
                  className="inline h-5 w-5 mr-2"
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
              <PencilIcon className="inline h-5 w-5 mr-2" aria-hidden="true" />
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

export default EditProfilePicture;
