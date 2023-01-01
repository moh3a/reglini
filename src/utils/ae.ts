import {
  Affiliate_Hotproducts_Params,
  Affiliate_Hotproducts_Result,
  Affiliate_Product_Details_Params,
  Affiliate_Product_Details_Result,
  DS_OrderAPI_Cancel_Order_Params,
  DS_OrderAPI_Cancel_Order_Result,
  DS_OrderAPI_Get_Order_Params,
  DS_OrderAPI_Get_Order_Result,
  DS_OrderAPI_Place_Order_Params,
  DS_OrderAPI_Place_Order_Result,
  DS_ProductAPI_Product_Detail_Params,
  DS_ProductAPI_Product_Detail_Result,
  DS_ProductAPI_Recommended_Products_Params,
  DS_ProductAPI_Recommended_Products_Result,
  DS_ShippingAPI_Shipping_Info_Params,
  DS_ShippingAPI_Shipping_Info_Result,
  DS_ShippingAPI_Tracking_Info_Params,
  DS_ShippingAPI_Tracking_Info_Result,
} from "@reglini-types/ae";
import { execute } from "@utils/ae_client";

export const AE_DS_searchProducts = async (
  search: string,
  locale?: string,
  page_size?: number,
  page_no?: number
) => {
  return await execute<
    DS_ProductAPI_Recommended_Products_Params,
    DS_ProductAPI_Recommended_Products_Result
  >("ds", "aliexpress.ds.recommend.feed.get", {
    feed_name: search,
    target_currency: "EUR",
    target_language: locale?.toUpperCase() as any,
    country: "DZ",
    sort: "DSRratingDesc",
    page_size,
    page_no,
  });
};

export const AE_DS_getProductDetail = async (
  product_id: number,
  locale?: string
) => {
  return await execute<
    DS_ProductAPI_Product_Detail_Params,
    DS_ProductAPI_Product_Detail_Result
  >("ds", "aliexpress.postproduct.redefining.findaeproductbyidfordropshipper", {
    local_country: "DZ",
    local_language: locale,
    product_id,
  });
};

export const AE_DS_getShippingInfo = async (
  product_id: number,
  quantity: number
) => {
  return await execute<
    DS_ShippingAPI_Shipping_Info_Params,
    DS_ShippingAPI_Shipping_Info_Result
  >("ds", "aliexpress.logistics.buyer.freight.calculate", {
    param_aeop_freight_calculate_for_buyer_d_t_o: JSON.stringify({
      country_code: "DZ",
      product_id,
      product_num: quantity,
      send_goods_country_code: "CN",
    }),
  });
};

export const AE_DS_getTrackingInfo = async (
  order_id: string,
  tracking_id: string,
  service_name: string
) => {
  return await execute<
    DS_ShippingAPI_Tracking_Info_Params,
    DS_ShippingAPI_Tracking_Info_Result
  >("ds", "aliexpress.logistics.ds.trackinginfo.query", {
    origin: "ESCROW",
    to_area: "DZ",
    out_ref: order_id,
    logistics_no: tracking_id,
    service_name,
  });
};

// export const AE_DS_createOrder = async () => {
//   return await execute<
//     DS_OrderAPI_Place_Order_Params,
//     DS_OrderAPI_Place_Order_Result
//   >("ds", "aliexpress.trade.buy.placeorder", {
//     param_place_order_request4_open_api_d_t_o: {
//       product_items: {},
//       logistics_address: {},
//     },
//   });
// };

export const AE_DS_getOrder = async (order_id: number) => {
  return await execute<
    DS_OrderAPI_Get_Order_Params,
    DS_OrderAPI_Get_Order_Result
  >("ds", "aliexpress.ds.trade.order.get", {
    order_id,
  });
};

export const AE_DS_cancelOrder = async (order_id: number) => {
  return await execute<
    DS_OrderAPI_Cancel_Order_Params,
    DS_OrderAPI_Cancel_Order_Result
  >("ds", "aliexpress.miniapp.order.cancel", { trade_order_id: order_id });
};

export const AE_Affiliate_Hotproducts = async (
  search?: string,
  page_size?: number,
  page_no?: number,
  locale?: string
) => {
  return await execute<
    Affiliate_Hotproducts_Params,
    Affiliate_Hotproducts_Result
  >("affiliate", "aliexpress.affiliate.hotproduct.query", {
    tracking_id: "reglinidz",
    keywords: search ?? undefined,
    page_size: page_size?.toString(),
    page_no: page_no?.toString(),
    target_language: locale?.toUpperCase(),
    target_currency: "EUR",
    ship_to_country: "DZ",
  });
};

export const AE_Affiliate_getProductDetails = async (
  product_ids: string,
  locale?: string
) => {
  return await execute<
    Affiliate_Product_Details_Params,
    Affiliate_Product_Details_Result
  >("affiliate", "aliexpress.affiliate.productdetail.get", {
    product_ids,
    country: "DZ",
    tracking_id: "reglinidz",
    target_currency: "EUR",
    target_language: locale?.toUpperCase(),
  });
};