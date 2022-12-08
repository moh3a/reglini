import { ChangeEvent, FormEvent, useRef, useState } from "react";
import {
  CheckBadgeIcon,
  CloudArrowDownIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import Button from "@components/shared/Button";
import { SHADOW } from "@config/design";

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

  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();
  };

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
    // if (!event.target.files?.length) {
    //   return;
    // } else {
    //   const formData = new FormData();
    //   Array.from(event.target.files).forEach((file) => {
    //     formData.append(event.target.name, file);
    //   });
    // const config: AxiosRequestConfig = {
    //   headers: { "content-type": "multipart/form-data" },
    //   onUploadProgress: (event) => {
    //     setProgress(Math.round((event.loaded * 100) / (event.total ?? 1)));
    //   },
    // };
    // const { data } = await axios.post("/api/uploads", formData, config);
    // if (data.success) {
    //   setTimeout(() => {
    //     setProgress(0);
    //   }, 1000);
    // }
    // }
  };

  return (
    <>
      {edit ? (
        <form onSubmit={submitHandler}>
          <div className="flex justify-between items-center">
            <div className="flex-1">
              {!newPicType && (
                <div className="font-mono">
                  generate a new avatar or upload a local image
                </div>
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
                  icon={
                    newPicType === "upload" && (
                      <CheckBadgeIcon
                        className="h-6 w-6 inline mr-1"
                        aria-hidden="true"
                      />
                    )
                  }
                >
                  upload
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
                  icon={
                    newPicType === "generate" && (
                      <CheckBadgeIcon
                        className="h-6 w-6 inline mr-1"
                        aria-hidden="true"
                      />
                    )
                  }
                >
                  generate
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
            >
              cancel
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
              save {field}
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
            edit {field}
          </Button>
        </>
      )}
    </>
  );
};

export default EditProfilePicture;
