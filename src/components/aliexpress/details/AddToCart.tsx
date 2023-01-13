import { Dispatch, SetStateAction } from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

import { ZAE_Product } from "@reglini-types/zapiex";
import { SelectedVariation } from "../ProductDetails";
import Button from "@components/shared/Button";
import { trpc } from "@utils/trpc";
import { GetPrice } from "@utils/index";
import { useFinance } from "@utils/store";
import { useTranslations } from "next-intl";

interface AddToCartProps {
  product: ZAE_Product;
  setMessage: Dispatch<
    SetStateAction<
      | {
          type?: "success" | "warning" | "error" | undefined;
          text?: string | undefined;
        }
      | undefined
    >
  >;
  selectedVariation?: SelectedVariation;
  selectedShipping?: ZAE_Product["shipping"]["carriers"]["0"];
}

const AddToCart = ({
  product,
  setMessage,
  selectedVariation,
  selectedShipping,
}: AddToCartProps) => {
  const { euro, commission } = useFinance();
  const { status } = useSession();
  const cartMutation = trpc.cart.add.useMutation();
  const utils = trpc.useContext();

  const cartHandler = async () => {
    if (selectedVariation && selectedShipping) {
      const price = GetPrice(
        euro ?? 0,
        commission ?? 0,
        selectedVariation.price.app.hasDiscount
          ? selectedVariation.price.app.discountedPrice.value
          : selectedVariation.price.app.originalPrice.value
      );
      const originalPrice = selectedVariation.price.app.hasDiscount
        ? selectedVariation.price.app.discountedPrice.value
        : selectedVariation.price.app.originalPrice.value;
      const shippingPrice = GetPrice(
        euro ?? 0,
        commission ?? 0,
        selectedShipping.price.value
      );

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
        if (!selectedVariation.sku && !selectedVariation.price.app) {
          setTimeout(() => {
            setMessage({ type: undefined, text: undefined });
          }, 3000);
          setMessage({ type: "error", text: "Please select the properties." });
        } else if (selectedVariation.sku || selectedVariation.price.app) {
          await cartMutation.mutateAsync(
            {
              productId: product.productId,
              name: product.title,
              price,
              originalPrice,
              imageUrl: selectedVariation.imageUrl,
              properties: selectedVariation.properties,
              quantity: selectedVariation.quantity ?? 1,
              sku: selectedVariation.sku,
              carrierId: selectedShipping.company.id,
              shippingPrice,
              totalPrice:
                price * (selectedVariation.quantity ?? 1) + shippingPrice,
            },
            {
              onSettled(data, error) {
                if (error) setMessage({ type: "error", text: error.message });
                if (data) {
                  if (!data.success)
                    setMessage({ type: "error", text: data.error });
                  else {
                    setMessage({ type: "success", text: data.message });
                    utils.cart.invalidate();
                  }
                }
              },
            }
          );
        }
      }
    }
  };
  const t = useTranslations("AliexpressPage");

  return (
    <Button
      disabled={!selectedVariation || !selectedShipping}
      icon={
        <ShoppingBagIcon className="h-5 w-5 inline mr-1" aria-hidden="true" />
      }
      onClick={() => cartHandler()}
      variant="outline"
      type="button"
    >
      {t("cart")}
    </Button>
  );
};

export default AddToCart;
