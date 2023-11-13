/* eslint-disable @next/next/no-img-element */
import {
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useRef,
  useState,
} from "react";
import {
  ArrowDownTrayIcon,
  CloudArrowDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios, { type AxiosRequestConfig } from "axios";
import { useTranslations } from "next-intl";

import {
  BG_TRANSPARENT_BACKDROP,
  ROUNDED,
  SHADOW,
  TEXT_GRADIENT,
  TEXT_INPUT,
} from "~/config/design";
import { API_RESPONSE_MESSAGES } from "~/config/constants";
import { Button, Loading } from "~/components/shared";
import { api } from "~/utils/api";
import type { ImageUploadApiResponse } from "~/types/index";
import { useMessage } from "~/utils/store";

interface ConfirmReceptionProps {
  order_id: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ConfirmReception = ({ order_id, setIsOpen }: ConfirmReceptionProps) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { setTimedMessage } = useMessage();

  const [image, setImage] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      const i = event.target.files[0];
      setImage(i);
      setValue(URL.createObjectURL(i));
    }
  };

  const [rating, setRating] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const receivedMutation = api.order.received.useMutation();
  const utils = api.useContext();

  const submitHandler = (event: FormEvent): void => {
    event.preventDefault();
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("folder", "received");
      formData.append("public_id", new Date().getTime().toString());
      const config: AxiosRequestConfig = {
        headers: { "content-type": "multipart/form-data" },
        onUploadProgress: (event) => {
          setProgress(Math.round((event.loaded * 100) / (event.total ?? 1)));
        },
      };
      axios
        .post<ImageUploadApiResponse>("/api/uploads/image", formData, config)
        .then((response) => {
          if (response?.data.success && response.data.url) {
            setProgress(0);
            setLoading(true);
            receivedMutation.mutate(
              {
                order_id,
                package_pic: response.data.url,
                rating,
                feedback: feedbackMessage,
              },
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
                      void utils.order.details.invalidate();
                    } else
                      setTimedMessage({
                        type: "error",
                        text: data.error ?? "",
                        duration: 3000,
                      });
                  }
                  setIsOpen(false);
                },
              },
            );
            setLoading(false);
          }
        })
        .catch(() => console.error(API_RESPONSE_MESSAGES.ERROR_OCCURED));
    }
  };

  const t = useTranslations("AccountPage");

  return (
    <section>
      <p>{t("orders.received.appreciated")}</p>
      <form className="my-2" onSubmit={submitHandler}>
        {loading && (
          <span className="font-mono text-sm">
            <Loading size="small" /> {t("details.loading")}...
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
        <div className="my-2">
          <h2 className="text-lg font-semibold">
            <span className={TEXT_GRADIENT}>{t("orders.received.title")}</span>
          </h2>
          {value && (
            <div className="truncate">
              <img
                src={value}
                alt="payment receipt"
                className={`m-1 w-52 truncate ${ROUNDED} ${SHADOW}`}
              />
            </div>
          )}
          <Button
            onClick={() => {
              fileInputRef.current?.click();
              setValue("");
            }}
            variant="solid"
            type="button"
            icon={
              <ArrowDownTrayIcon
                className="mr-1 inline h-6 w-6"
                aria-hidden="true"
              />
            }
          >
            {t("orders.received.upload")}
          </Button>
          <input
            accept="image/*"
            name={"upload_receipt"}
            onChange={onChangeHandler}
            ref={fileInputRef}
            maxLength={1}
            style={{ display: "none" }}
            type="file"
          />
        </div>
        <div className="my-4">
          <div className="mb-2">
            <h2 className="text-lg font-semibold">
              <span className={TEXT_GRADIENT}>
                {t("orders.received.feedback")}
              </span>
            </h2>
            <p className="font-mono">{t("orders.received.appreciated")}</p>
          </div>
          <div className="flex space-x-2">
            <p>{t("orders.received.rate")}</p>
            <div className="flex space-x-0">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  onClick={() => setRating(star)}
                  className={`h-4 w-4 cursor-pointer fill-current ${
                    rating >= star ? "text-yellow-400" : "text-gray-400"
                  }  hover:text-yellow-500`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
          </div>
          <div>
            <textarea
              className={`w-full ${TEXT_INPUT} `}
              rows={2}
              placeholder="Leave a feedback message (optional)"
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-2 flex justify-end space-x-2">
          <Button
            variant="outline"
            icon={
              <XMarkIcon className="mr-2 inline h-5 w-5" aria-hidden="true" />
            }
            onClick={() => setIsOpen(false)}
            type="button"
          >
            {t("orders.received.cancel")}
          </Button>
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
            {t("orders.received.send")}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ConfirmReception;
