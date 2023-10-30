import type { Dispatch, SetStateAction } from "react";
import { CursorArrowRaysIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import type { RAE_Product, RAE_ProductShippingCarrier } from "~/types/ae/rae";
import type { IMessage, SelectedVariation } from "~/types/index";
import { Button } from "~/components/shared";
import { GetPrice } from "~/utils/index";
import { useFinance } from "~/utils/store";

interface BuyProductProps {
  product: RAE_Product;
  setMessage: Dispatch<SetStateAction<IMessage | undefined>>;
  selectedVariation?: SelectedVariation;
  selectedShipping?: RAE_ProductShippingCarrier;
}

export const BuyProduct = ({
  product,
  setMessage,
  selectedVariation,
  selectedShipping,
}: BuyProductProps) => {
  const { commission, euro } = useFinance();
  const { status } = useSession();
  const router = useRouter();

  const buyHandler = () => {
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
          localStorage.setItem(
            "aeno",
            JSON.stringify([
              {
                productId: product.productId,
                name: product.title,
                price,
                originalPrice,
                imageUrl:
                  selectedVariation.imageUrl ?? product.productImages[0],
                properties: selectedVariation.properties,
                quantity: selectedVariation.quantity,
                sku: selectedVariation.sku,
                carrierId: selectedShipping.company.id,
                shippingPrice,
                totalPrice:
                  price * (selectedVariation.quantity ?? 1) + shippingPrice,
              },
            ]),
          );
          void router.push("/account/orders/new");
        }
      }
    }
  };
  const t = useTranslations("AliexpressPage");

  return (
    <Button
      disabled={!selectedVariation || !selectedShipping}
      icon={
        <CursorArrowRaysIcon
          className="mr-1 inline h-5 w-5"
          aria-hidden="true"
        />
      }
      onClick={() => buyHandler()}
      variant="solid"
      type="button"
    >
      {t("buy")}
    </Button>
  );
};
