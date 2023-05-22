/* eslint-disable @next/next/no-img-element */
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useRef,
  useState,
  useEffect,
} from "react";
import Link from "next/link";
import axios, { AxiosRequestConfig } from "axios";
import {
  ArrowDownTrayIcon,
  CheckBadgeIcon,
  CloudArrowDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { RadioGroup } from "@headlessui/react";
import { useTranslations } from "next-intl";

import {
  BG_GRADIENT,
  BG_TRANSPARENT_BACKDROP,
  ROUNDED,
  SHADOW,
  TEXT_GRADIENT,
} from "@config/design";
import Banner from "@components/shared/Banner";
import Button from "@components/shared/Button";
import Loading from "@components/shared/Loading";
import { trpc } from "@utils/trpc";
import { IMessage } from "@reglini-types/index";
import { Product } from "@prisma/client";

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
      for (let i = 0; i < products.length; i++) {
        total += products[i].totalPrice ?? 0;
      }
      return total;
    });
  }, [products]);

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<IMessage>();

  const [image, setImage] = useState<any>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onChangeHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setValue(URL.createObjectURL(i));
    }
  };

  const [method, setMethod] = useState<"CIB" | "CCP">("CIB");
  const payMutation = trpc.order.pay.useMutation();
  const utils = trpc.useContext();
  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();
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
    const { data } = await axios.post("/api/uploads/image", formData, config);
    if (data.success) {
      setProgress(0);
      setLoading(true);
      await payMutation.mutateAsync(
        { order_id, receipt_url: data.url, method },
        {
          onSettled(data, error) {
            if (error) setMessage({ type: "error", text: error.message });
            if (data) {
              if (data.success) {
                setMessage({ type: "success", text: data.message });
                utils.order.details.invalidate();
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

        <div className="my-8 flex flex-col lg:flex-row justify-center items-center text-lg">
          <h3 className="mr-2 font-bold">{t("paymentMethod")}:</h3>
          <RadioGroup value={method} onChange={setMethod}>
            <RadioGroup.Label className="sr-only">
              payment method:{" "}
            </RadioGroup.Label>
            <div className="flex flex-col sm:flex-row w-full space-x-2 text-base">
              {PAYMENT_METHODS.map((method) => (
                <RadioGroup.Option key={method} value={method}>
                  {({ checked }) => (
                    <div
                      className={`cursor-pointer px-1 py-0.5 ${
                        checked ? `${BG_GRADIENT} text-white -skew-x-6` : ""
                      }`}
                    >
                      {checked && (
                        <CheckBadgeIcon className="h-5 w-5 inline relative bottom-0.5 mr-1 text-white" />
                      )}
                      {method}
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
        <div className="leading-none my-8">
          <Link href={"/faq"} target="_blank">
            <div className="text-xs lg:text-base  font-mono text-gray-500 my-6">
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
              <span className="font-bold mx-1">007 99999 0020008646 02</span>
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
            className={` ${BG_TRANSPARENT_BACKDROP} mx-auto max-w-md rounded-full h-2.5 mt-4 `}
          >
            <div
              className="bg-aliexpress h-2.5 rounded-full"
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
                className="h-6 w-6 inline mr-1"
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
              <XMarkIcon className="inline h-5 w-5 mr-2" aria-hidden="true" />
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
                className="inline h-5 w-5 mr-2"
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
