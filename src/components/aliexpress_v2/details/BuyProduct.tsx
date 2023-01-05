import { Dispatch, SetStateAction } from "react";
import { CursorArrowRaysIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Button from "@components/shared/Button";
import { SelectedVariation } from "../ProductDetails";
import {
  DS_ProductAPI_Product_Details,
  DS_ShippingAPI_Shipping_Info_Result,
} from "@reglini-types/ae";

interface BuyProductProps {
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

const BuyProduct = ({
  product,
  discount,
  setMessage,
  selectedVariation,
  selectedShipping,
}: BuyProductProps) => {
  const { status } = useSession();
  const router = useRouter();

  const buyHandler = () => {
    const discountRate = discount < 95 ? discount / 100 : 0;
    if (selectedVariation && selectedShipping) {
      const price = discountRate
        ? parseFloat(selectedVariation.offer_sale_price)
        : parseFloat(selectedVariation.sku_price);
      const shippingPrice = selectedShipping.freight.amount;
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
          localStorage.setItem(
            "aeno",
            JSON.stringify([
              {
                productId: product.product_id.toString(),
                name: product.subject,
                price,
                originalPrice: price,
                imageUrl: selectedVariation.imageUrl,
                properties: selectedVariation.aeop_s_k_u_propertys,
                quantity: selectedVariation.quantity ?? 1,
                sku: selectedVariation.sku_code,
                carrierId: selectedShipping.service_name,
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
