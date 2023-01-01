import { DS_ShippingAPI_Shipping_Info_Params } from "@reglini-types/ae";
import { execute } from "@utils/ae_client";

export const AE_getShippingInfo = async (
  product_id: number,
  quantity: number
) => {
  const data = await execute<DS_ShippingAPI_Shipping_Info_Params, any>(
    "ds",
    "aliexpress.logistics.buyer.freight.calculate",
    {
      param_aeop_freight_calculate_for_buyer_d_t_o: JSON.stringify({
        country_code: "DZ",
        product_id,
        product_num: quantity,
        send_goods_country_code: "CN",
      }),
    }
  );
  return data;
};
