import { useSession } from "next-auth/react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

import type { RAE_Product } from "~/types/ae/rae";
import { Button } from "~/components/shared";
import { api } from "~/utils/api";
import { GetPrice } from "~/utils/index";
import { useFinance, useMessage } from "~/utils/store";

interface AddToWishlistProps {
  product: RAE_Product;
}

export const AddToWishlist = ({ product }: AddToWishlistProps) => {
  const { status } = useSession();
  const { setTimedMessage } = useMessage();
  const { commission, euro } = useFinance();
  const wishlistMutation = api.wishlist.add.useMutation();

  const wishlistHandler = async () => {
    if (status === "unauthenticated") {
      setTimedMessage({
        type: "error",
        text: "You should be logged in to do this action.",
        duration: 3000,
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
            if (error)
              setTimedMessage({
                type: "error",
                text: error.message ?? "",
                duration: 3000,
              });
            if (data) {
              if (!data.success)
                setTimedMessage({
                  type: "error",
                  text: data.error ?? "",
                  duration: 3000,
                });
              else
                setTimedMessage({
                  type: "success",
                  text: data.message ?? "",
                  duration: 3000,
                });
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
