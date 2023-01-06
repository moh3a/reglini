import { Dispatch, SetStateAction } from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

import { SelectedVariation } from "../ProductDetails";
import Button from "@components/shared/Button";
import { trpc } from "@utils/trpc";
import {
  DS_ProductAPI_Product_Details,
  DS_ShippingAPI_Shipping_Info_Result,
} from "@reglini-types/ae";
import { GetPrice } from "@utils/index";
import { useFinance } from "@utils/store";

interface AddToCartProps {
  product: DS_ProductAPI_Product_Details;
  discount: number;
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
  selectedShipping?: DS_ShippingAPI_Shipping_Info_Result["result"]["aeop_freight_calculate_result_for_buyer_d_t_o_list"][0];
}

const AddToCart = ({
  product,
  discount,
  setMessage,
  selectedVariation,
  selectedShipping,
}: AddToCartProps) => {
  const { usd, commission } = useFinance();
  const { status } = useSession();
  const cartMutation = trpc.cart.add.useMutation();
  const utils = trpc.useContext();

  const cartHandler = async () => {
    const discountRate = discount < 95 ? discount / 100 : 0;
    if (selectedVariation && selectedShipping) {
      const price = GetPrice(
        usd ?? 0,
        commission ?? 0,
        discountRate
          ? parseFloat(selectedVariation.offer_sale_price)
          : parseFloat(selectedVariation.sku_price)
      );
      const originalPrice = discountRate
        ? parseFloat(selectedVariation.offer_sale_price)
        : parseFloat(selectedVariation.sku_price);
      const shippingPrice = GetPrice(
        usd ?? 0,
        commission ?? 0,
        selectedShipping.freight.amount
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
        if (
          !selectedVariation.sku_price &&
          !selectedVariation.offer_sale_price
        ) {
          setTimeout(() => {
            setMessage({ type: undefined, text: undefined });
          }, 3000);
          setMessage({ type: "error", text: "Please select the properties." });
        } else if (
          selectedVariation.sku_price ||
          selectedVariation.offer_sale_price
        ) {
          await cartMutation.mutateAsync(
            {
              productId: product.product_id.toString(),
              name: product.subject,
              price,
              originalPrice,
              imageUrl: selectedVariation.imageUrl,
              properties: selectedVariation.aeop_s_k_u_propertys,
              quantity: selectedVariation.quantity ?? 1,
              sku: selectedVariation.sku_code,
              carrierId: selectedShipping.service_name,
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
