import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import type { SelectedVariation } from "~/types/index";
import type { RAE_Product, RAE_ProductShippingCarrier } from "~/types/ae/rae";
import { Button } from "~/components/shared";
import { api } from "~/utils/api";
import { GetPrice } from "~/utils/index";
import { useFinance, useMessage } from "~/utils/store";

interface AddToCartProps {
  product: RAE_Product;
  selectedVariation?: SelectedVariation;
  selectedShipping?: RAE_ProductShippingCarrier;
}

export const AddToCart = ({
  product,
  selectedVariation,
  selectedShipping,
}: AddToCartProps) => {
  const { status } = useSession();
  const { setTimedMessage } = useMessage();
  const cartMutation = api.cart.add.useMutation();
  const utils = api.useContext();
  const { commission, euro } = useFinance();

  const cartHandler = async () => {
    if (selectedVariation && selectedShipping) {
      if (status === "unauthenticated") {
        setTimedMessage({
          type: "error",
          text: "You should be logged in to do this action.",
          duration: 3000,
        });
      }
      if (status === "authenticated") {
        if (!selectedVariation.sku && !selectedVariation.price.app) {
          setTimedMessage({
            type: "error",
            text: "Please select the properties.",
            duration: 3000,
          });
        } else if (selectedVariation.sku || selectedVariation.price.app) {
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
                  else {
                    setTimedMessage({
                      type: "success",
                      text: data.message ?? "",
                      duration: 3000,
                    });
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
