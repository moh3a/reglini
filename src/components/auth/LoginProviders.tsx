import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

import { PADDING, ROUNDED } from "~/config/design";
import { Button } from "~/components/shared";
import type { AuthProps } from "~/types";

const LoginProviders = ({
  providers,
}: {
  providers: AuthProps["providers"];
}) => {
  const t = useTranslations("AuthPage.providers");

  return (
    <div className="flex flex-col lg:py-6">
      {providers &&
        Object.values(providers).map((provider) => {
          if (provider.name === "credentials") return;
          if (provider.id === "google") {
            return (
              <div key={provider.name} className="my-1">
                <Button
                  onClick={() => void signIn(provider.id, { redirect: true })}
                  tabIndex={5}
                  type="button"
                  className={` w-full transform border-black bg-black text-center font-bold text-white transition duration-500 ease-in-out hover:bg-gray-100 hover:text-black ${PADDING} ${ROUNDED} disabled:cursor-not-allowed disabled:border-0 disabled:bg-gray-500 `}
                >
                  <i className="fab fa-google mr-2"></i>
                  {t("continue", { provider: "Google" })}
                </Button>
              </div>
            );
          }
          if (provider.id === "facebook") {
            return (
              <div key={provider.name} className="my-1">
                <Button
                  onClick={() => void signIn(provider.id, { redirect: true })}
                  tabIndex={5}
                  type="button"
                  className={` w-full transform border-facebook bg-facebook text-center font-bold text-white transition duration-500 ease-in-out hover:bg-gray-100 hover:text-facebook ${PADDING} ${ROUNDED} disabled:cursor-not-allowed disabled:border-0 disabled:bg-gray-500 `}
                >
                  <i className="fab fa-facebook-f mr-2"></i>
                  {t("continue", { provider: "Facebook" })}
                </Button>
              </div>
            );
          }
        })}
    </div>
  );
};

export default LoginProviders;
