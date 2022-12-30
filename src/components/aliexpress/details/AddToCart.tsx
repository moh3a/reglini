import { Dispatch, SetStateAction } from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

import { ZAE_Product } from "@config/zapiex";
import { SelectedVariation } from "../ProductDetails";
import Button from "@components/shared/Button";
import { trpc } from "@utils/trpc";

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
  const { status } = useSession();
  const cartMutation = trpc.cart.add.useMutation();

  const cartHandler = async () => {
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
          await cartMutation.mutateAsync(
            {
              id: product.productId,
              name: product.title,
              price,
              originalPrice: price,
              imageUrl: selectedVariation.imageUrl,
              properties: selectedVariation.properties,
              quantity: selectedVariation.quantity ?? 1,
              sku: selectedVariation.sku,
              carrierId: selectedShipping.company.id,
              shippingPrice: shippingPrice,
              totalPrice:
                (price + shippingPrice) * (selectedVariation.quantity ?? 1),
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
      }
    }
  };

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
      Cart
    </Button>
  );
};

export default AddToCart;
