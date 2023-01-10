import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";

import Button from "@components/shared/Button";
import { trpc } from "@utils/trpc";

const Cancel = ({
  orderId,
  setIsOpen,
  setMessage,
}: {
  orderId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setMessage: Dispatch<
    SetStateAction<{
      type?: "error" | "success" | undefined;
      text?: string | undefined;
    }>
  >;
}) => {
  const router = useRouter();
  const cancelMutation = trpc.order.cancel.useMutation();
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

  return (
    <div className="flex flex-col justify-center items-center">
      <p>Are you sure you want to cancel this order?</p>
      <div className="flex space-x-4">
        <Button variant="outline" onClick={cancelHandler}>
          Yes
        </Button>
        <Button variant="solid" onClick={() => setIsOpen(false)}>
          No
        </Button>
      </div>
    </div>
  );
};

export default Cancel;
