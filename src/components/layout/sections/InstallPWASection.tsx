/* eslint-disable @next/next/no-img-element */
import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { useInstallPWA } from "~/utils/store";
import { Button } from "~/components/shared";
import { install_pwa_handler } from "~/utils";

export const InstallPWASection = () => {
  const t = useTranslations("IndexPage.installHero");
  const { set_prompt, set_can_install, can_install, prompt } = useInstallPWA();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        set_can_install(true);
        set_prompt(e as BeforeInstallPromptEvent);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const installHandler = () => {
    if (prompt)
      install_pwa_handler(prompt, () => {
        set_can_install(false);
        set_prompt(undefined);
      });
  };

  return (
    <>
      {can_install && (
        <div className="mx-auto flex max-w-xl justify-between px-3 py-14 lg:py-32">
          <div>
            {t.rich("title", {
              logo: () => (
                <img
                  className="mx-1 inline"
                  src="/icon-192x192.png"
                  alt="reglini logo"
                  height={20}
                  width={20}
                />
              ),
            })}
          </div>
          <div className="flex justify-end">
            <Button variant="solid" onClick={installHandler}>
              {t("button")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
