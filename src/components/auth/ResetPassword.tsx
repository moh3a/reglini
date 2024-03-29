import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  ArrowPathRoundedSquareIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

import { PasswordInput, Title, Button } from "~/components/shared";
import { api } from "~/utils/api";
import { useMessage } from "~/utils/store";

const ResetPassword = ({ token }: { token: string }) => {
  const router = useRouter();
  const { setMessage, resetMessage } = useMessage();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [requirements, setRequirements] = useState(false);

  const [checkUpperCase, setCheckUpperCase] = useState(false);
  const [checkLowerCase, setCheckLowerCase] = useState(false);
  const [checkNumber, setCheckNumber] = useState(false);
  const [checkLength, setCheckLength] = useState(false);

  const [passwordValidation, setPasswordValidation] = useState(false);

  const changePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword("");
    setConfirmed(false);
    setPassword(e.target.value);
    if (/[a-z]/g.test(e.target.value)) {
      setCheckLowerCase(true);
    } else if (!/[a-z]/g.test(e.target.value)) {
      setCheckLowerCase(false);
    }
    if (/[A-Z]/g.test(e.target.value)) {
      setCheckUpperCase(true);
    } else if (!/[A-Z]/g.test(e.target.value)) {
      setCheckUpperCase(false);
    }
    if (/[0-9]/g.test(e.target.value)) {
      setCheckNumber(true);
    } else if (!/[0-9]/g.test(e.target.value)) {
      setCheckNumber(false);
    }
    if (e.target.value.length >= 8) {
      setCheckLength(true);
    } else if (e.target.value.length < 8) {
      setCheckLength(false);
    }
  };

  const changeConfirmedPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (password === e.target.value && confirmPassword.length > 1) {
      setConfirmed(true);
    } else {
      setConfirmed(false);
    }
  };

  useEffect(() => {
    if (
      !checkUpperCase ||
      !checkLowerCase ||
      !checkNumber ||
      !checkLength ||
      !confirmPassword ||
      !confirmed
    ) {
      setPasswordValidation(false);
    } else if (
      confirmPassword &&
      checkUpperCase &&
      checkLowerCase &&
      checkNumber &&
      checkLength &&
      confirmed
    ) {
      setPasswordValidation(true);
    }
  }, [
    checkUpperCase,
    confirmPassword,
    checkLowerCase,
    checkNumber,
    checkLength,
    confirmed,
    setPasswordValidation,
  ]);

  const resetMutation = api.auth.resetPassword.useMutation();
  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    if (passwordValidation) {
      resetMutation.mutate(
        { token, password },
        {
          onSettled(data, error) {
            if (error) setMessage({ type: "error", text: error.message ?? "" });
            if (data) {
              if (data.success) {
                setMessage({ type: "success", text: data.message ?? "" });

                void router.replace("/");
              } else setMessage({ type: "error", text: data.message ?? "" });
            }
            setTimeout(() => {
              resetMessage();
              void signOut();
            }, 3000);
          },
        },
      );
    }
  };
  const t = useTranslations("AuthPage.register");

  return (
    <form
      autoComplete="off"
      onSubmit={submitHandler}
      className="m-auto max-w-lg"
    >
      <Title center={true} title="Reset your password" />
      <div className="my-3">
        <label className="block leading-relaxed" htmlFor="password">
          {t("password")}
        </label>
        <PasswordInput
          id="password"
          name="password"
          placeholder="******"
          required
          tabIndex={3}
          width="100%"
          value={password}
          onFocus={() => setRequirements(true)}
          onChange={(e) => changePassword(e)}
          onBlur={() => setRequirements(false)}
        />
      </div>
      <div className="my-3">
        <label className="block leading-relaxed" htmlFor="confirm">
          {t("passwordConfirm")}
        </label>
        <PasswordInput
          id="confirm"
          name="confirm"
          placeholder="******"
          required={true}
          tabIndex={4}
          width="100%"
          value={confirmPassword}
          onChange={(e) => changeConfirmedPassword(e)}
        />
        {confirmPassword ? (
          confirmed ? (
            <p className="text-success">{t("confirmed")}</p>
          ) : (
            <p className="text-danger">{t("notConfirmed")}</p>
          )
        ) : (
          ""
        )}
      </div>

      {requirements && (
        <div className="w-full p-4">
          Password must contain the following fields
          <p className={checkUpperCase ? "text-success" : "text-danger"}>
            {checkUpperCase ? (
              <CheckBadgeIcon className="mx-1 inline h-5 w-5" />
            ) : (
              <XMarkIcon className="mx-1 inline h-5 w-5" />
            )}
            An uppercase letter
          </p>
          <p className={checkLowerCase ? "text-success" : "text-danger"}>
            {checkLowerCase ? (
              <CheckBadgeIcon className="mx-1 inline h-5 w-5" />
            ) : (
              <XMarkIcon className="mx-1 inline h-5 w-5" />
            )}
            A lowercaser letter
          </p>
          <p className={checkNumber ? "text-success" : "text-danger"}>
            {checkNumber ? (
              <CheckBadgeIcon className="mx-1 inline h-5 w-5" />
            ) : (
              <XMarkIcon className="mx-1 inline h-5 w-5" />
            )}
            A number
          </p>
          <p className={checkLength ? "text-success" : "text-danger"}>
            {checkLength ? (
              <CheckBadgeIcon className="mx-1 inline h-5 w-5" />
            ) : (
              <XMarkIcon className="mx-1 inline h-5 w-5" />
            )}
            Minimum 8 characters
          </p>
        </div>
      )}
      <div className="my-3 flex items-center justify-center">
        <Button
          type="submit"
          variant="solid"
          disabled={!passwordValidation}
          icon={
            <ArrowPathRoundedSquareIcon
              aria-hidden="true"
              className="mr-1 inline h-6 w-6"
            />
          }
        >
          {t("submit")}
        </Button>
      </div>
    </form>
  );
};

export default ResetPassword;
