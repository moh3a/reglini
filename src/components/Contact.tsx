import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { ROUNDED, SHADOW, TEXT_INPUT } from "@config/design";
import TextInput from "./shared/Input";
import Button from "./shared/Button";
import Title from "./shared/Title";
import { trpc } from "@utils/trpc";
import Banner from "./shared/Banner";

const Contact = () => {
  const router = useRouter();
  const emailMutation = trpc.email.useMutation();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState<{
    type?: "error" | "success";
    text?: string;
  }>();

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (subject && message) {
      await emailMutation.mutateAsync(
        { message, subject },
        {
          onSettled(data, error) {
            setSubject("");
            setMessage("");
            if (data) {
              if (data.success)
                setNotification({ type: "success", text: data.message });
              if (!data.success)
                setNotification({ type: "error", text: data.message });
            } else if (error)
              setNotification({ type: "error", text: error.message });
          },
        }
      );
    } else {
      setNotification({
        type: "error",
        text: "Fill both the subject and the message.",
      });
      setTimeout(() => {
        setNotification({ type: undefined, text: undefined });
      }, 3000);
    }
  };
  const t = useTranslations("SupportPage");

  return (
    <>
      <Title title={t("title")} />
      <p className="mb-4 font-bold font-mono text-sm text-center">
        {t("subtitle")}
      </p>

      <section
        className={`w-full max-w-2xl px-6 py-4 mx-auto lg:mb-32 my-8 ${ROUNDED} ${SHADOW} `}
      >
        {notification?.type && (
          <Banner type={notification.type} message={notification.text} />
        )}
        <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 md:grid-cols-3">
          <div
            className={`cursor-pointer flex flex-col items-center px-4 py-3 ${ROUNDED} hover:bg-purple-200 dark:hover:bg-purple-800`}
          >
            <svg
              className="w-5 h-5 text-purple-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>

            <span className="mt-2">{t("contact.address")}</span>
          </div>
          <div
            className={`cursor-pointer flex flex-col items-center px-4 py-3 ${ROUNDED} hover:bg-green-200 dark:hover:bg-green-800`}
          >
            <i className="fab fa-whatsapp text-green-500"></i>
            <span className="mt-2">{t("contact.phoneNumber")}</span>
          </div>
          <div
            className={`cursor-pointer flex flex-col items-center px-4 py-3 ${ROUNDED} hover:bg-orange-200 dark:hover:bg-orange-800 text-xs`}
          >
            <svg
              className="w-5 h-5 text-orange-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span className="mt-2">{t("contact.email")}</span>
          </div>
        </div>
        <p className="my-4 text-base text-center md:text-lg">
          {t("directToFaq.youHaveAQuestion")}{" "}
          <Link href="/faq" passHref>
            <span className="underline text-gray-700 dark:text-gray-400">
              {t("directToFaq.checkoutAnswer")}
            </span>
          </Link>
        </p>

        <form className="mt-6 " onSubmit={submitHandler}>
          <div className="items-center -mx-2 md:flex">
            <div className="w-full mx-2">
              <label
                htmlFor="subject"
                className={`block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200`}
              >
                {t("form.emailSubject")}
              </label>

              <TextInput
                id="subject"
                name="subject"
                type="text"
                placeholder={t("form.emailSubject")}
                autocomplete={false}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                width="100%"
              />
            </div>
          </div>

          <div className="w-full mt-4">
            <label
              htmlFor="message"
              className={`block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200`}
            >
              {t("form.message")}
            </label>

            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ width: "100%" }}
              className={TEXT_INPUT}
            ></textarea>
          </div>

          <div className="flex justify-center mt-6">
            <Button variant="solid" type="submit">
              {t("form.send")}
            </Button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Contact;
