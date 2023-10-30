import type { Dispatch, SetStateAction } from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import type { IMessage, SelectedVariation } from "~/types/index";
import type { RAE_Product, RAE_ProductShippingCarrier } from "~/types/ae/rae";
import { Button } from "~/components/shared";
import { api } from "~/utils/api";
import { GetPrice } from "~/utils/index";
import { useFinance } from "~/utils/store";

interface AddToCartProps {
  product: RAE_Product;
  setMessage: Dispatch<SetStateAction<IMessage | undefined>>;
  selectedVariation?: SelectedVariation;
  selectedShipping?: RAE_ProductShippingCarrier;
}

export const AddToCart = ({
  product,
  setMessage,
  selectedVariation,
  selectedShipping,
}: AddToCartProps) => {
  const { euro, commission } = useFinance();
  const { status } = useSession();
  const cartMutation = api.cart.add.useMutation();
  const utils = api.useContext();

  const cartHandler = async () => {
    if (selectedVariation && selectedShipping) {
      const price = GetPrice(
        euro ?? 0,
        commission ?? 0,
        selectedVariation.price.app.hasDiscount
          ? selectedVariation.price.app.discountedPrice.value
          : selectedVariation.price.app.originalPrice.value,
      );
      const originalPrice = selectedVariation.price.app.hasDiscount
        ? selectedVariation.price.app.discountedPrice.value
        : selectedVariation.price.app.originalPrice.value;
      const shippingPrice = GetPrice(
        euro ?? 0,
        commission ?? 0,
        selectedShipping.price.value,
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
              imageUrl: selectedVariation.imageUrl ?? product.productImages[0],
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
                    void utils.cart.invalidate();
                  }
                }
              },
            },
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
        <ShoppingBagIcon className="mr-1 inline h-5 w-5" aria-hidden="true" />
      }
      onClick={() => void cartHandler()}
      variant="outline"
      type="button"
    >
      {t("cart")}
    </Button>
  );
};
