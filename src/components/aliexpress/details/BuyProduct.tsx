import { Dispatch, SetStateAction } from "react";
import { CursorArrowRaysIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import Button from "@components/shared/Button";
import { ZAE_Product } from "@reglini-types/zapiex";
import { SelectedVariation } from "@components/aliexpress/ProductDetails";
import { GetPrice } from "@utils/index";
import { useFinance } from "@utils/store";

interface BuyProductProps {
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

const BuyProduct = ({
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
            ])
          );
          router.push("/account/orders/new");
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
          className="h-5 w-5 inline mr-1"
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

export default BuyProduct;
