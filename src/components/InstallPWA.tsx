/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

import { useInstallPWA } from "@utils/store";
import Button from "./shared/Button";
import Toast from "./shared/Toast";

const InstallPWA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { set_prompt, set_can_install, can_install, prompt } = useInstallPWA();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        set_can_install(true);
        set_prompt(e);
        setIsOpen(true);
      });
    }
  }, []);

  const installHandler = async () => {
    setIsOpen(false);
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    console.log("response to install: " + outcome);
    set_can_install(false);
    set_prompt(undefined);
  };

  return (
    <>
      {can_install && (
        <Toast isOpen={isOpen} setIsOpen={setIsOpen}>
          <div className="flex justify-between p-4">
            <div>
              <img
                src="/icon-192x192.png"
                alt="reglini logo"
                height={20}
                width={20}
              />
              <span>
                Would you like to install the reglini app to your device?
              </span>
            </div>
            <div>
              <Button variant="solid" onClick={installHandler}>
                Install
              </Button>
            </div>
          </div>
        </Toast>
      )}
    </>
  );
};

export default InstallPWA;
