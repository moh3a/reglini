import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import ValidateEmail from "~/components/auth/register-validation/ValidateEmail";
import ValidatePassword from "~/components/auth/register-validation/ValidatePassword";
import { Button, TextInput } from "~/components/shared";

const Register = ({ csrfToken }: { csrfToken: string }) => {
  const [valid, setValid] = useState(false);
  const [name, setName] = useState("");
  const [emailValidation, setEmailValidation] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(false);

  useEffect(() => {
    if (passwordValidation && emailValidation) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [passwordValidation, emailValidation]);
  const t = useTranslations("AuthPage.register");

  return (
    <>
      <form
        className="mt-6"
        autoComplete="off"
        method="POST"
        action="/api/auth/callback/register-credentials"
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

        <div className="my-3">
          <label htmlFor="name" className="block leading-relaxed">
            {t("username")}
          </label>
          <TextInput
            id="name"
            name="name"
            type="text"
            placeholder={t("username")}
            tabIndex={1}
            required={true}
            value={name}
            width="100%"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <ValidateEmail setEmailValidation={setEmailValidation} />
        <ValidatePassword setPasswordValidation={setPasswordValidation} />

        {valid ? (
          <Button type="submit" variant="solid" tabIndex={3} width="100%">
            {t("title")}
          </Button>
        ) : (
          <p className="text-center text-danger cursor-pointer">
            {t("correctIt")}
          </p>
        )}
      </form>

      <div className="mt-2 mb-8 text-center">
        {t("haveAccount")}{" "}
        <Link href="/auth/login">
          <Button variant="outline" tabIndex={4}>
            {t("signIn")}
          </Button>
        </Link>
      </div>
    </>
  );
};

export default Register;
