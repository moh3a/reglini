/* eslint-disable @next/next/no-img-element */
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useRef,
  useState,
} from "react";
import {
  ArrowDownTrayIcon,
  CloudArrowDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios, { AxiosRequestConfig } from "axios";
import { useTranslations } from "next-intl";

import {
  BG_TRANSPARENT_BACKDROP,
  ROUNDED,
  SHADOW,
  TEXT_GRADIENT,
  TEXT_INPUT,
} from "@config/design";
import { Button, Loading } from "@components/shared";
import { trpc } from "@utils/trpc";
import type { IMessage } from "@reglini-types/index";

interface ConfirmReceptionProps {
  order_id: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setMessage: Dispatch<SetStateAction<IMessage | undefined>>;
}

const ConfirmReception = ({
  order_id,
  setIsOpen,
  setMessage,
}: ConfirmReceptionProps) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [image, setImage] = useState<any>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onChangeHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setValue(URL.createObjectURL(i));
    }
  };

  const [rating, setRating] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const receivedMutation = trpc.order.received.useMutation();
  const utils = trpc.useContext();
  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();
    let image_resp: any;
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
      const { data } = await axios.post("/api/uploads/image", formData, config);
      image_resp = data;
    }
    setProgress(0);
    setLoading(true);
    await receivedMutation.mutateAsync(
      {
        order_id,
        package_pic: image_resp && image_resp.url ? image_resp.url : undefined,
        rating,
        feedback: feedbackMessage,
      },
      {
        onSettled(data, error) {
          if (error) setMessage({ type: "error", text: error.message });
          if (data) {
            if (data.success) {
              setMessage({ type: "success", text: data.message });
              utils.order.details.invalidate();
            } else setMessage({ type: "error", text: data.error });
          }
          setIsOpen(false);
          setTimeout(() => {
            setMessage({ type: undefined, text: undefined });
          }, 3000);
        },
      }
    );
    setLoading(false);
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
            className={` ${BG_TRANSPARENT_BACKDROP} mx-auto max-w-md rounded-full h-2.5 mt-4 `}
          >
            <div
              className="bg-aliexpress h-2.5 rounded-full"
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
                className="h-6 w-6 inline mr-1"
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
                  className={`w-4 h-4 cursor-pointer fill-current ${
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
        <div className="flex justify-end mt-2 space-x-2">
          <Button
            variant="outline"
            icon={
              <XMarkIcon className="inline h-5 w-5 mr-2" aria-hidden="true" />
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
                className="inline h-5 w-5 mr-2"
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
