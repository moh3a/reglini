import { useState, useEffect } from "react";
import { CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { PasswordInput } from "~/components/shared";

const ValidatePassword = ({ setPasswordValidation }: any) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [requirements, setRequirements] = useState(false);

  const [checkUpperCase, setCheckUpperCase] = useState(false);
  const [checkLowerCase, setCheckLowerCase] = useState(false);
  const [checkNumber, setCheckNumber] = useState(false);
  const [checkLength, setCheckLength] = useState(false);

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

  const changePassword = (e: any) => {
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

  const changeConfirmedPassword = (e: any) => {
    setConfirmPassword(e.target.value);
    if (password === e.target.value && confirmPassword.length > 1) {
      setConfirmed(true);
    } else {
      setConfirmed(false);
    }
  };
  const t = useTranslations("AuthPage.register");

  return (
    <>
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
              <CheckBadgeIcon className="h-5 w-5 inline mx-1" />
            ) : (
              <XMarkIcon className="h-5 w-5 inline mx-1" />
            )}
            An uppercase letter
          </p>
          <p className={checkLowerCase ? "text-success" : "text-danger"}>
            {checkLowerCase ? (
              <CheckBadgeIcon className="h-5 w-5 inline mx-1" />
            ) : (
              <XMarkIcon className="h-5 w-5 inline mx-1" />
            )}
            A lowercaser letter
          </p>
          <p className={checkNumber ? "text-success" : "text-danger"}>
            {checkNumber ? (
              <CheckBadgeIcon className="h-5 w-5 inline mx-1" />
            ) : (
              <XMarkIcon className="h-5 w-5 inline mx-1" />
            )}
            A number
          </p>
          <p className={checkLength ? "text-success" : "text-danger"}>
            {checkLength ? (
              <CheckBadgeIcon className="h-5 w-5 inline mx-1" />
            ) : (
              <XMarkIcon className="h-5 w-5 inline mx-1" />
            )}
            Minimum 8 characters
          </p>
        </div>
      )}
    </>
  );
};

export default ValidatePassword;
