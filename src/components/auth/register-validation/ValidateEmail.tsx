import { useState, useEffect } from "react";
import { trpc } from "@utils/trpc";
import TextInput from "../../shared/Input";
import { useTranslations } from "next-intl";
import { IMessage } from "@reglini-types/index";

const ValidateEmail = ({ setEmailValidation }: any) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<IMessage>();
  const emailExistsMutation = trpc.auth.checkEmail.useMutation();

  useEffect(() => {
    if (email && message?.type !== "error") {
      setEmailValidation(true);
    } else {
      setEmailValidation(false);
    }
  }, [email, message, setEmailValidation]);

  const checkEmail = async () => {
    if (!email)
      return setMessage({ type: "error", text: "Email cannot be blank." });
    const isValid =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      );
    if (!isValid)
      return setMessage({
        type: "error",
        text: "You should enter a valid email.",
      });
    await emailExistsMutation.mutateAsync(
      { email },
      {
        onSettled(data, error) {
          if (error)
            return setMessage({
              type: "error",
              text: error.message,
            });
          else if (data) {
            if (data.success) {
              if (data.exists) {
                return setMessage({
                  type: "error",
                  text: "Email address used already.",
                });
              } else return setMessage({ type: "success", text: "Ok." });
            } else
              return setMessage({
                type: "error",
                text: "You should be logged in.",
              });
          }
        },
      }
    );
  };
  const t = useTranslations("AuthPage.register");

  return (
    <div className="my-3">
      <label htmlFor="email" className="block leading-relaxed">
        {t("email")}
      </label>
      <TextInput
        id="email"
        name="email"
        type="email"
        placeholder="user@example.com"
        autocomplete={false}
        required={true}
        tabIndex={2}
        value={email}
        width="100%"
        onChange={(e) => {
          setEmail(e.target.value);
          setMessage({ type: undefined, text: undefined });
        }}
        onBlur={() => checkEmail()}
      />

      {message && message.type && (
        <p
          className={
            message.type === "error"
              ? "text-danger"
              : message.type === "success"
              ? "text-success"
              : ""
          }
        >
          {message.text}
        </p>
      )}
    </div>
  );
};

export default ValidateEmail;
