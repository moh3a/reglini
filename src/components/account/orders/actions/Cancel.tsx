import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { Button } from "~/components/shared";
import { api } from "~/utils/api";
import type { IMessage } from "~/types/index";

const Cancel = ({
  orderId,
  setIsOpen,
  setMessage,
}: {
  orderId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setMessage: Dispatch<SetStateAction<IMessage | undefined>>;
}) => {
  const router = useRouter();
  const cancelMutation = api.order.cancel.useMutation();
  const cancelHandler = async () => {
    await cancelMutation.mutateAsync(
      { order_id: orderId },
      {
        onSettled(data, error) {
          if (error) setMessage({ type: "error", text: error.message });
          if (data) {
            if (data.success) {
              setMessage({ type: "success", text: data.message });
            } else setMessage({ type: "error", text: data.error });
          }
          setIsOpen(false);
          setTimeout(() => {
            setMessage({ type: undefined, text: undefined });
            router.push("/account/orders");
          }, 3000);
        },
      }
    );
  };

  const t = useTranslations("AccountPage.orders.cancel");

  return (
    <div className="flex flex-col justify-center items-center">
      <p>{t("question")}</p>
      <div className="flex space-x-4">
        <Button variant="outline" onClick={cancelHandler}>
          {t("yes")}
        </Button>
        <Button variant="solid" onClick={() => setIsOpen(false)}>
          {t("no")}
        </Button>
      </div>
    </div>
  );
};

export default Cancel;
