/* eslint-disable @next/next/no-img-element */
import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { useInstallPWA } from "~/utils/store";
import { Button } from "~/components/shared";
import { CloudArrowDownIcon } from "@heroicons/react/24/outline";

const Install = () => {
  const t = useTranslations("Common");
  const { set_prompt, set_can_install, can_install, prompt } = useInstallPWA();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        set_can_install(true);
        set_prompt(e);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const installHandler = async () => {
    prompt.prompt();
    await prompt.userChoice;
    set_can_install(false);
    set_prompt(undefined);
  };

  return (
    <div>
      {can_install && (
        <Button
          variant="outline"
          icon={<CloudArrowDownIcon className="h-5 w-5 inline mx-1" />}
          onClick={installHandler}
        >
          {t("install")}
        </Button>
      )}
    </div>
  );
};

export default Install;
