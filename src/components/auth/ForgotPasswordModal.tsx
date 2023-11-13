import { type FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

import { api } from "~/utils/api";
import { Button, TextInput, Modal } from "~/components/shared";
import { useMessage } from "~/utils/store";

export default function ForgotPasswordModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { setMessage } = useMessage();
  const forgotPasswordMutation = api.auth.forgotPasswordHandler.useMutation();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const forgotPasswordHandler = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        forgotPasswordMutation.mutate(
          { email },
          {
            onSettled(data, error) {
              if (error) setMessage({ type: "error", text: error.message });
              else if (data) {
                if (data.success) {
                  setMessage({ type: "success", text: data.message ?? "" });
                } else setMessage({ type: "error", text: data.message ?? "" });
              }
            },
          },
        );
      } catch (error) {
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
