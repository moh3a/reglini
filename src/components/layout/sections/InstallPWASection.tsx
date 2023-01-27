/* eslint-disable @next/next/no-img-element */
import { useEffect } from "react";

import { useInstallPWA } from "@utils/store";
import Button from "../../shared/Button";

const InstallPWASection = () => {
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
  }, []);

  const installHandler = async () => {
    prompt.prompt();
    await prompt.userChoice;
    set_can_install(false);
    set_prompt(undefined);
  };

  return (
    <>
      {can_install && (
        <div className="flex justify-between p-2">
          <div>
            <img
              className="inline"
              src="/icon-192x192.png"
              alt="reglini logo"
              height={20}
              width={20}
            />
            <span>
              Would you like to install the reglini app to your device?
            </span>
          </div>
          <div className="flex justify-end">
            <Button variant="solid" onClick={installHandler}>
              Install
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallPWASection;
