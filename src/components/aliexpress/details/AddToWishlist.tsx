import { Dispatch, SetStateAction } from "react";
import { useSession } from "next-auth/react";
import { HeartIcon } from "@heroicons/react/24/solid";

import { ZAE_Product } from "@reglini-types/zapiex";
import Button from "@components/shared/Button";
import { trpc } from "@utils/trpc";
import { GetPrice } from "@utils/index";
import { useFinance } from "@utils/store";
import { useTranslations } from "next-intl";
import { IMessage } from "@reglini-types/index";

interface AddToWishlistProps {
  product: ZAE_Product;
  setMessage: Dispatch<SetStateAction<IMessage | undefined>>;
}

const AddToWishlist = ({ product, setMessage }: AddToWishlistProps) => {
  const { commission, euro } = useFinance();
  const { status } = useSession();
  const wishlistMutation = trpc.wishlist.add.useMutation();

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
    if (status === "authenticated") {
      await wishlistMutation.mutateAsync(
        {
          productId: product.productId,
          name: product.title,
          price: GetPrice(
            euro ?? 0,
            commission ?? 0,
            product.price.app.originalPrice.value
          ),
          imageUrl: product.productImages[0],
        },
        {
          onSettled(data, error, variables, context) {
            if (error) setMessage({ type: "error", text: error.message });
            if (data) {
              if (!data.success)
                setMessage({ type: "error", text: data.error });
              else setMessage({ type: "success", text: data.message });
            }
          },
        }
      );
    }
  };
  const t = useTranslations("AliexpressPage");

  return (
    <Button
      icon={<HeartIcon className="h-5 w-5 inline mr-1" aria-hidden="true" />}
      onClick={() => wishlistHandler()}
      variant="outline"
      type="button"
    >
      {t("wishlist")}
    </Button>
  );
};

export default AddToWishlist;
