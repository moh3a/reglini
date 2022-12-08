import { FormEvent, useState } from "react";
import { trpc } from "@utils/trpc";
import Button from "../shared/Button";
import TextInput from "../shared/Input";
import Modal from "../shared/Modal";

export default function ForgotPasswordModal() {
  let [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{
    type?: "success" | "error";
    text?: string;
  }>();
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
            onSettled(data, error, variables, context) {
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
        setMessage({ type: "error", text: error.response.data.error });
      }
    }
    setEmail("");
  };

  return (
    <>
      <div className="flex justify-center">
        <Button
          variant="outline"
          type="button"
          tabIndex={4}
          onClick={openModal}
        >
          Forgot password?
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Forgot your password?"
      >
        <form onSubmit={forgotPasswordHandler}>
          <div className="my-2 text-sm">
            Please enter the email address you registered your account with. We
            will send you a password reset link. Follow the link and set your
            new password.
          </div>

          <div className="my-2">
            <TextInput
              type="email"
              required={true}
              id="email"
              placeholder="Email address"
              value={email}
              autocomplete={false}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="my-4">
            <Button onClick={closeModal} type="submit" variant="solid">
              Send email!
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
