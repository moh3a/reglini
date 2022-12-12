import { Dispatch, SetStateAction } from "react";
import { CursorArrowRaysIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Button from "@components/shared/Button";
import { ZAE_Product } from "@config/zapiex";
import { SelectedVariation } from "../ProductDetails";

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
  const { status } = useSession();
  const router = useRouter();

  const buyHandler = () => {
    if (selectedVariation && selectedShipping) {
      let price, shippingPrice: any;
      if (selectedVariation.sku || selectedVariation.price.app) {
        price = selectedVariation.price.app.hasDiscount
          ? selectedVariation.price.app.discountedPrice.value
          : selectedVariation.price.app.originalPrice.value;
        shippingPrice = selectedShipping.price.value;
      }
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
                originalPrice: price,
                imageUrl: selectedVariation.imageUrl,
                properties: selectedVariation.properties,
                quantity: selectedVariation.quantity,
                sku: selectedVariation.sku,
                carrierId: selectedShipping.company.id,
                shippingPrice: shippingPrice,
                totalPrice:
                  (price + shippingPrice) * (selectedVariation.quantity ?? 1),
              },
            ])
          );
          router.push("/account/orders/new");
        }
      }
    }
  };

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
      Buy
    </Button>
  );
};

export default BuyProduct;
