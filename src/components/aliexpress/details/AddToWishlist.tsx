import type { Dispatch, SetStateAction } from "react";
import { useSession } from "next-auth/react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

import type { RAE_Product } from "~/types/ae/rae";
import type { IMessage } from "~/types/index";
import { Button } from "~/components/shared";
import { api } from "~/utils/api";
import { GetPrice } from "~/utils/index";
import { useFinance } from "~/utils/store";

interface AddToWishlistProps {
  product: RAE_Product;
  setMessage: Dispatch<SetStateAction<IMessage | undefined>>;
}

export const AddToWishlist = ({ product, setMessage }: AddToWishlistProps) => {
  const { commission, euro } = useFinance();
  const { status } = useSession();
  const wishlistMutation = api.wishlist.add.useMutation();

  const wishlistHandler = async () => {
    if (status === "unauthenticated") {
      setTimeout(() => {
        setMessage({ type: undefined, text: undefined });
      }, 3000);
      setMessage({
        type: "error",
        text: "You should be logged in to do this action.",
      });
    }
    if (status === "authenticated" && product.price) {
      await wishlistMutation.mutateAsync(
        {
          productId: product.productId,
          name: product.title,
          price: GetPrice(
            euro ?? 0,
            commission ?? 0,
            product.price.app.originalPrice.value,
          ),
          imageUrl: product.productImages[0] ?? "",
        },
        {
          onSettled(data, error) {
            if (error) setMessage({ type: "error", text: error.message });
            if (data) {
              if (!data.success)
                setMessage({ type: "error", text: data.error });
              else setMessage({ type: "success", text: data.message });
            }
          },
        },
      );
    }
  };
  const t = useTranslations("AliexpressPage");

  return (
    <Button
      icon={<HeartIcon className="mr-1 inline h-5 w-5" aria-hidden="true" />}
      onClick={() => void wishlistHandler()}
      variant="outline"
      type="button"
    >
      {t("wishlist")}
    </Button>
  );
};
