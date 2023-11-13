import type { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/shared";
import { api } from "~/utils/api";
import { useMessage } from "~/utils/store";
import { useRouter } from "next/router";

const Cancel = ({
  orderId,
  setIsOpen,
}: {
  orderId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const { setTimedMessage } = useMessage();
  const cancelMutation = api.order.cancel.useMutation();
  const cancelHandler = () => {
    cancelMutation.mutate(
      { order_id: orderId },
      {
        onSettled(data, error) {
          if (error)
            setTimedMessage({
              type: "error",
              text: error.message ?? "",
              duration: 3000,
            });
          if (data) {
            if (data.success) {
              setTimedMessage({
                type: "success",
                text: data.message ?? "",
                duration: 3000,
              });
            } else
              setTimedMessage({
                type: "error",
                text: data.error ?? "",
                duration: 3000,
              });
          }
          setIsOpen(false);
          setTimeout(() => {
            void router.push("/account/orders");
          }, 3000);
        },
      },
    );
  };

  const t = useTranslations("AccountPage.orders.cancel");

  return (
    <div className="flex flex-col items-center justify-center">
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
