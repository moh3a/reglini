/* eslint-disable @next/next/no-img-element */
import {
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useRef,
  useState,
  useEffect,
} from "react";
import Link from "next/link";
import axios, { type AxiosRequestConfig } from "axios";
import {
  ArrowDownTrayIcon,
  CheckBadgeIcon,
  CloudArrowDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { RadioGroup } from "@headlessui/react";
import { useTranslations } from "next-intl";
import type { Product } from "@prisma/client";

import {
  BG_GRADIENT,
  BG_TRANSPARENT_BACKDROP,
  ROUNDED,
  SHADOW,
  TEXT_GRADIENT,
} from "~/config/design";
import { API_RESPONSE_MESSAGES } from "~/config/constants";
import { Banner, Button, Loading } from "~/components/shared";
import { api } from "~/utils/api";
import type { IMessage, ImageUploadApiResponse } from "~/types/index";

interface PaymentProps {
  order_id: string;
  products: Product[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const PAYMENT_METHODS = ["CIB", "CCP"];

const Pay = ({ order_id, products, setIsOpen }: PaymentProps) => {
  const [price, setPrice] = useState(0);
  useEffect(() => {
    setPrice(() => {
      let total = 0;
      for (const product of products) {
        total += product?.totalPrice ?? 0;
      }
      return total;
    });
  }, [products]);

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<IMessage>();

  const [image, setImage] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      const i = event?.target?.files[0];
      setImage(i);
      setValue(URL.createObjectURL(i));
    }
  };

  const [method, setMethod] = useState<"CIB" | "CCP">("CIB");
  const payMutation = api.order.pay.useMutation();
  const utils = api.useContext();

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();

    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("folder", "payments");
      formData.append("public_id", new Date().getTime().toString());

      const config: AxiosRequestConfig = {
        headers: { "content-type": "multipart/form-data" },
        onUploadProgress: (event) => {
          setProgress(Math.round((event.loaded * 100) / (event.total ?? 1)));
        },
      };

      axios
        .post<ImageUploadApiResponse>("/api/uploads/image", formData, config)
        .then(({ data }) => {
          if (data.success) {
            setProgress(0);
            setLoading(true);
            payMutation.mutate(
              { order_id, receipt_url: data.url, method },
              {
                onSettled(data, error) {
                  if (error) setMessage({ type: "error", text: error.message });
                  if (data) {
                    if (data.success) {
                      setMessage({ type: "success", text: data.message });
                      void utils.order.details.invalidate();
                    } else setMessage({ type: "error", text: data.error });
                  }
                  setTimeout(() => {
                    setMessage({ type: undefined, text: undefined });
                  }, 3000);
                },
              },
            );
          } else {
            setMessage({ type: "error", text: data.message });
          }
        })
        .catch(() => console.error(API_RESPONSE_MESSAGES.ERROR_OCCURED));
    }
    setLoading(false);
  };

  const t = useTranslations("AccountPage.orders.pay");

  return (
    <>
      <div className="my-8">
        <div>
          {t.rich("amountToBePaid", {
            price: price,
            highlight: (chunks) => (
              <span className={`font-mono ${TEXT_GRADIENT} `}>{chunks}</span>
            ),
          })}
        </div>

        <div className="my-8 flex flex-col items-center justify-center text-lg lg:flex-row">
          <h3 className="mr-2 font-bold">{t("paymentMethod")}:</h3>
          <RadioGroup value={method} onChange={setMethod}>
            <RadioGroup.Label className="sr-only">
              payment method:{" "}
            </RadioGroup.Label>
            <div className="flex w-full flex-col space-x-2 text-base sm:flex-row">
              {PAYMENT_METHODS.map((method) => (
                <RadioGroup.Option key={method} value={method}>
                  {({ checked }) => (
                    <div
                      className={`cursor-pointer px-1 py-0.5 ${
                        checked ? `${BG_GRADIENT} -skew-x-6 text-white` : ""
                      }`}
                    >
                      {checked && (
                        <CheckBadgeIcon className="relative bottom-0.5 mr-1 inline h-5 w-5 text-white" />
                      )}
                      {method}
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
        <div className="my-8 leading-none">
          <Link href={"/faq"} target="_blank">
            <div className="my-6 font-mono  text-xs text-gray-500 lg:text-base">
              {t("howToPay")}
            </div>
          </Link>

          {method === "CCP" && (
            <div>
              <div>{t("ccp.desc")}</div>
              <p>
                {t.rich("ccp.name", {
                  name: "AIT ABDELMALEK MOHAMED ALI",
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </p>
              <p>
                {t.rich("ccp.id", {
                  id: "0020008646 02",
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </p>
            </div>
          )}
          {method === "CIB" && (
            <div>
              {t("cib.desc")}:
              <span className="mx-1 font-bold">007 99999 0020008646 02</span>
            </div>
          )}
        </div>
      </div>
      <form className="my-8" onSubmit={submitHandler}>
        {message?.type && (
          <Banner type={message?.type} message={message?.text} />
        )}
        {loading && (
          <span className="font-mono text-sm">
            <Loading size="small" /> loading...
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
        {value && (
          <div className="truncate">
            <img
              src={value}
              alt="payment receipt"
              className={`m-1 w-52 truncate ${ROUNDED} ${SHADOW}`}
            />
          </div>
        )}
        <div>
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
            {t("upload")}
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
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            icon={
              <XMarkIcon className="mr-2 inline h-5 w-5" aria-hidden="true" />
            }
            onClick={() => setIsOpen(false)}
            type="button"
          >
            {t("cancel")}
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
            {t("send")}
          </Button>
        </div>
      </form>
    </>
  );
};

export default Pay;
