import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { ROUNDED, SHADOW, TEXT_INPUT } from "~/config/design";
import { TextInput, Button, Title, Banner } from "~/components/shared";
import { api } from "~/utils/api";

const Contact = () => {
  const emailMutation = api.email.useMutation();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState<{
    type?: "error" | "success";
    text?: string;
  }>();

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (subject && message) {
      emailMutation.mutate(
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
        },
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
      <Title center={true} title={t("title")} />
      <p className="mb-4 text-center font-mono text-sm font-bold">
        {t("subtitle")}
      </p>

      <section
        className={`mx-auto my-8 w-full max-w-2xl px-6 py-4 lg:mb-32 ${ROUNDED} ${SHADOW} `}
      >
        {notification?.type && (
          <Banner type={notification.type} message={notification.text} />
        )}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div
            className={`flex cursor-pointer flex-col items-center px-4 py-3 ${ROUNDED} hover:bg-purple-200 dark:hover:bg-purple-800`}
          >
            <svg
              className="h-5 w-5 text-purple-600"
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
            className={`flex cursor-pointer flex-col items-center px-4 py-3 ${ROUNDED} hover:bg-green-200 dark:hover:bg-green-800`}
          >
            <i className="fab fa-whatsapp text-green-500"></i>
            <span className="mt-2">{t("contact.phoneNumber")}</span>
          </div>
          <div
            className={`flex cursor-pointer flex-col items-center px-4 py-3 ${ROUNDED} text-xs hover:bg-orange-200 dark:hover:bg-orange-800`}
          >
            <svg
              className="h-5 w-5 text-orange-500"
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
        <p className="my-4 text-center text-base md:text-lg">
          {t("directToFaq.youHaveAQuestion")}{" "}
          <Link href="/faq" passHref>
            <span className="text-gray-700 underline dark:text-gray-400">
              {t("directToFaq.checkoutAnswer")}
            </span>
          </Link>
        </p>

        <form className="mt-6 " onSubmit={submitHandler}>
          <div className="-mx-2 items-center md:flex">
            <div className="mx-2 w-full">
              <label
                htmlFor="subject"
                className={`mb-2 block text-sm font-medium text-gray-600 dark:text-gray-200`}
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

          <div className="mt-4 w-full">
            <label
              htmlFor="message"
              className={`mb-2 block text-sm font-medium text-gray-600 dark:text-gray-200`}
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

          <div className="mt-6 flex justify-center">
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
