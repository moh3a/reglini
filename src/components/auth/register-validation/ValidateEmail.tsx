import { useState, useEffect, type SetStateAction, type Dispatch } from "react";
import { useTranslations } from "next-intl";

import { TextInput } from "~/components/shared";
import { api } from "~/utils/api";
import { useMessage } from "~/utils/store";

const ValidateEmail = ({
  setEmailValidation,
}: {
  setEmailValidation: Dispatch<SetStateAction<boolean>>;
}) => {
  const [email, setEmail] = useState("");
  const { setTimedMessage, type, resetMessage } = useMessage();
  const emailExistsMutation = api.auth.checkEmail.useMutation();

  useEffect(() => {
    if (email && type !== "error") {
      setEmailValidation(true);
    } else {
      setEmailValidation(false);
    }
  }, [email, type, setEmailValidation]);

  const checkEmail = async () => {
    if (!email)
      return setTimedMessage({
        type: "error",
        text: "Email cannot be blank.",
        duration: 3000,
      });
    const isValid =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email,
      );
    if (!isValid)
      return setTimedMessage({
        type: "error",
        text: "You should enter a valid email.",
        duration: 3000,
      });
    await emailExistsMutation.mutateAsync(
      { email },
      {
        onSettled(data, error) {
          if (error)
            return setTimedMessage({
              type: "error",
              text: error.message ?? "",
              duration: 3000,
            });
          else if (data) {
            if (data.success) {
              if (data.exists) {
                return setTimedMessage({
                  type: "error",
                  text: "Email address used already.",
                  duration: 3000,
                });
              } else
                return setTimedMessage({
                  type: "success",
                  text: "Ok.",
                  duration: 3000,
                });
            } else
              return setTimedMessage({
                type: "error",
                text: "You should be logged in.",
                duration: 3000,
              });
          }
        },
      },
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
          resetMessage();
        }}
        onBlur={() => void checkEmail()}
      />
    </div>
  );
};

export default ValidateEmail;
