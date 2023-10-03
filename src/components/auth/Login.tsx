import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import ForgotPasswordModal from "~/components/auth/ForgotPasswordModal";
import { TextInput, PasswordInput, Button } from "~/components/shared";
import { trpc } from "~/utils/trpc";

const Login = ({ csrfToken }: { csrfToken: string }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const emailExistsMutation = trpc.auth.checkEmail.useMutation();

  const checkEmail = async () => {
    if (!email) return setError("Email cannot be blank.");
    const isValid =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      );
    if (!isValid) return setError("You should enter a valid email.");
    await emailExistsMutation.mutateAsync(
      { email },
      {
        onSettled(data, error) {
          if (error) return setError(error.message);
          else if (data) {
            if (data.success) {
              if (data.exists) {
                return;
              } else return setError("Email address does not exist.");
            } else return setError("You should be logged in.");
          }
        },
      }
    );
  };
  const t = useTranslations("AuthPage.login");

  return (
    <>
      <form
        className="mt-6"
        autoComplete="off"
        method="POST"
        action="/api/auth/callback/login-credentials"
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

        <div className="my-3">
          <label htmlFor="email" className="block leading-relaxed">
            {t("email")}
          </label>
          <TextInput
            id="email"
            type="email"
            name="email"
            placeholder="user@example.com"
            autocomplete={false}
            required={true}
            tabIndex={1}
            value={email}
            width="100%"
            onChange={(e) => {
              setError("");
              setEmail(e.target.value);
            }}
            onBlur={() => checkEmail()}
          />
          {error && <p className="text-danger">{error}</p>}
        </div>

        <div className="my-3">
          <label className="block leading-relaxed" htmlFor="password">
            {t("password")}
          </label>
          <PasswordInput
            id="password"
            name="password"
            tabIndex={2}
            placeholder="******"
            value={password}
            width="100%"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {password && !error ? (
          <Button type="submit" variant="solid" tabIndex={3} width="100%">
            {t("title")}
          </Button>
        ) : (
          <p className="text-center text-danger cursor-pointer">
            {t("correctIt")}
          </p>
        )}
      </form>

      <ForgotPasswordModal />
      <div className="mt-2 mb-8 text-center">
        {t("dontHaveAccount")}{" "}
        <Link href="/auth/register">
          <Button variant="outline" tabIndex={4}>
            {t("createOne")}
          </Button>
        </Link>
      </div>
    </>
  );
};

export default Login;
