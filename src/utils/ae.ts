import {
  Affiliate_Categories_Result,
  Affiliate_Hotproducts_Params,
  Affiliate_Hotproducts_Result,
  Affiliate_Product_Details_Params,
  Affiliate_Product_Details_Result,
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
    target_currency: "USD",
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

export const AE_DS_createOrder = async (
  logistics_address: {
    address: string;
    city?: string;
    contact_person?: string;
    country?: string;
    full_name?: string;
    mobile_no?: string;
    phone_country?: string;
    province?: string;
    zip?: string;
  },
  product_items: {
    logistics_service_name?: string;
    order_memo?: string;
    product_count: number;
    product_id: number;
    sku_attr?: string;
  }[]
) => {
  const new_logistics: any = {};
  const sorted_logistics = Object.keys(logistics_address).sort();
  for (let i = 0; i < sorted_logistics.length; i++) {
    new_logistics[sorted_logistics[i]] =
      logistics_address[sorted_logistics[i] as keyof typeof logistics_address];
  }

  const new_products: any[] = [];
  for (let i = 0; i < product_items.length; i++) {
    const new_product: any = {};
    const sorted_product = Object.keys(product_items[i]).sort();
    for (let j = 0; j < sorted_product.length; j++) {
      new_product[sorted_product[j]] =
        product_items[i][sorted_product[j] as keyof (typeof product_items)[0]];
    }
    new_products.push(new_product);
  }

  return await execute<
    DS_OrderAPI_Place_Order_Params,
    DS_OrderAPI_Place_Order_Result
  >("ds", "aliexpress.trade.buy.placeorder", {
    param_place_order_request4_open_api_d_t_o: JSON.stringify({
      logistics_address: new_logistics,
      product_items: new_products,
    }),
  });
};

export const AE_DS_getOrder = async (order_id: number) => {
  return await execute<
    DS_OrderAPI_Get_Order_Params,
    DS_OrderAPI_Get_Order_Result
  >("ds", "aliexpress.ds.trade.order.get", {
    order_id,
  });
};

export const AE_Affiliate_Hotproducts = async (
  category_ids: string,
  page_size?: number,
  page_no?: number,
  locale?: string
) => {
  return await execute<
    Affiliate_Hotproducts_Params,
    Affiliate_Hotproducts_Result
  >("affiliate", "aliexpress.affiliate.hotproduct.query", {
    platform_product_type: "ALL",
    category_ids,
    fields: "app_sale_price,shop_id",
    tracking_id: "reglinidz",
    page_size: page_size?.toString(),
    page_no: page_no?.toString(),
    target_language: locale?.toUpperCase(),
    target_currency: "USD",
    ship_to_country: "DZ",
  });
};

export const AE_Affiliate_getCategories = async () => {
  const result = await execute<{}, Affiliate_Categories_Result>(
    "affiliate",
    "aliexpress.affiliate.category.get",
    {}
  );
  let categories = "";
  result.resp_result.result.categories.forEach((category, index) => {
    let separation = "";
    if (index !== 0) separation = ",";
    if (!category.parent_category_id)
      categories += separation + category.category_id;
  });
  return categories;
};

export const AE_Affiliate_getCategoryById = async (category_id: number) => {
  const result = await execute<{}, Affiliate_Categories_Result>(
    "affiliate",
    "aliexpress.affiliate.category.get",
    {}
  );
  return result.resp_result.result.categories.find(
    (category) => category.category_id === category_id
  );
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
    fields: "commission_rate,sale_price",
    country: "DZ",
    tracking_id: "reglinidz",
    target_currency: "USD",
    target_language: locale?.toUpperCase(),
  });
};

export const ALIEXPRESS = {
  ds: {
    searchProducts: AE_DS_searchProducts,
    productDetails: AE_DS_getProductDetail,
    shipping: AE_DS_getShippingInfo,
    tracking: AE_DS_getTrackingInfo,
    createOrder: AE_DS_createOrder,
    getOrder: AE_DS_getOrder,
  },
  affiliate: {
    hotproducts: AE_Affiliate_Hotproducts,
    productDetails: AE_Affiliate_getProductDetails,
    categories: AE_Affiliate_getCategories,
    categoryById: AE_Affiliate_getCategoryById,
  },
};
