import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

import { trpc } from "@utils/trpc";
import { Button, TextInput, Modal, Banner } from "@components/shared";
import type { IMessage } from "@reglini-types/index";

export default function ForgotPasswordModal() {
  let [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<IMessage>();
  const forgotPasswordMutation = trpc.auth.forgotPasswordHandler.useMutation();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const forgotPasswordHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        await forgotPasswordMutation.mutateAsync(
          { email },
          {
            onSettled(data, error) {
              if (error) setMessage({ type: "error", text: error.message });
              else if (data) {
                if (data.success) {
                  setMessage({ type: "success", text: data.message });
                } else setMessage({ type: "error", text: data.message });
              }
            },
          }
        );
      } catch (error: any) {
        setMessage({ type: "error", text: JSON.stringify(error) });
      }
    }
    setEmail("");
  };
  const t = useTranslations("AuthPage.forgotPassword");

  return (
    <>
      <div className="flex justify-center">
        <Button
          variant="outline"
          type="button"
          tabIndex={4}
          onClick={openModal}
        >
          {t("title")}
        </Button>
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={t("title")}>
        <form onSubmit={forgotPasswordHandler}>
          {message?.type && (
            <Banner message={message?.text} type={message?.type} />
          )}
          <div className="my-2 text-sm">{t("desc")}</div>

          <div className="my-2">
            <TextInput
              type="email"
              required={true}
              id="email"
              placeholder={t("email")}
              value={email}
              autocomplete={false}
              onChange={(e) => setEmail(e.target.value)}
              width="100%"
            />
          </div>

          <div className="my-4">
            <Button onClick={closeModal} type="submit" variant="solid">
              {t("send")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
