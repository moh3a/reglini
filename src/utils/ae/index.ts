import type { Affiliate_Categories_Result } from "@reglini-types/ae";
import {
  API_AE_AFFILIATE_PRODUCTS_ARGUMENTS,
  API_AE_DS_SHIPPING_ARGUMENTS,
  API_AE_DS_TRACKING_ARGUMENTS,
} from "@reglini-types/ae/pinky";
import type {
  AENOLogisticsAddress,
  AENOProductItem,
} from "@reglini-types/index";
import { execute } from "@utils/ae/client";

// ! NOT USED
// todo try refreshing ae access_token with https://open.taobao.com/api.htm?docId=25387&docType=2&scopeId=381
export const AE_Auth_refreshToken = async (refresh_token: string) =>
  await execute("auth", "taobao.top.auth.token.refresh", { refresh_token });

// ! NOT USED
export const AE_DS_searchProducts = async (
  search: string,
  locale?: string,
  page_size?: string,
  page_no?: string
) =>
  await execute("ds", "aliexpress.ds.recommend.feed.get", {
    feed_name: search,
    target_currency: "USD",
    target_language: locale?.toUpperCase() as any,
    country: "DZ",
    sort: "DSRratingAsc",
    page_size,
    page_no,
  });

// ! NOT USED
export const AE_DS_getProduct = async (
  product_id: number,
  ship_to_country?: string,
  target_currency?: string,
  target_language?: string
) =>
  await execute("ds", "aliexpress.ds.product.get", {
    product_id,
    ship_to_country,
    target_currency,
    target_language,
  });

export const AE_DS_getProductDetail = async (
  product_id: number,
  locale?: string
) => {
  return await execute(
    "ds",
    "aliexpress.postproduct.redefining.findaeproductbyidfordropshipper",
    {
      local_country: "DZ",
      local_language: locale,
      product_id,
    }
  );
};

export const AE_DS_getShippingInfo = async ({
  product_id,
  quantity,
}: API_AE_DS_SHIPPING_ARGUMENTS) => {
  return await execute("ds", "aliexpress.logistics.buyer.freight.calculate", {
    param_aeop_freight_calculate_for_buyer_d_t_o: JSON.stringify({
      country_code: "DZ",
      product_id,
      product_num: quantity,
      send_goods_country_code: "CN",
    }),
  });
};

export const AE_DS_getTrackingInfo = async ({
  order_id,
  tracking_id,
  service_name,
}: API_AE_DS_TRACKING_ARGUMENTS) => {
  return await execute("ds", "aliexpress.logistics.ds.trackinginfo.query", {
    origin: "ESCROW",
    to_area: "DZ",
    out_ref: order_id,
    logistics_no: tracking_id,
    service_name,
  });
};

export const AE_DS_createOrder = async (
  logistics_address: AENOLogisticsAddress,
  product_items: AENOProductItem[]
) => {
  return await execute("ds", "aliexpress.trade.buy.placeorder", {
    param_place_order_request4_open_api_d_t_o: JSON.stringify({
      logistics_address,
      product_items,
    }),
  });
};

export const AE_DS_getOrder = async (order_id: number) =>
  await execute("ds", "aliexpress.ds.trade.order.get", {
    order_id,
  });

export const AE_Affiliate_Query_Products = async ({
  search,
  category_ids,
  page_size,
  page_no,
  locale,
}: API_AE_AFFILIATE_PRODUCTS_ARGUMENTS) => {
  return await execute("affiliate", "aliexpress.affiliate.product.query", {
    keywords: search,
    category_ids,
    platform_product_type: "ALL",
    fields: "shop_id", // "app_sale_price,shop_id",
    tracking_id: "reglinidz",
    page_size: page_size?.toString(),
    page_no: page_no?.toString(),
    target_language: locale?.toUpperCase(),
    target_currency: "USD",
    ship_to_country: "DZ",
  });
};

// ! NOT USED
export const AE_Affiliate_Hotproducts = async (
  category_ids: string,
  keywords?: string,
  page_size?: number,
  page_no?: number,
  locale?: string
) => {
  return await execute("affiliate", "aliexpress.affiliate.hotproduct.query", {
    category_ids,
    keywords,
    platform_product_type: "ALL",
    fields: "shop_id", // "app_sale_price,shop_id",
    tracking_id: "reglinidz",
    page_size: page_size?.toString(),
    page_no: page_no?.toString(),
    target_language: locale?.toUpperCase(),
    target_currency: "USD",
    ship_to_country: "DZ",
  });
};

export const AE_Affiliate_getCategories = async () => {
  const result = await execute(
    "affiliate",
    "aliexpress.affiliate.category.get",
    null
  );
  let categories = "";
  if (
    result &&
    result.resp_result &&
    result.resp_result.result &&
    result.resp_result.result.categories.length > 0
  )
    result.resp_result.result.categories.forEach((category, index) => {
      let separation = "";
      if (index !== 0) separation = ",";
      if (!category.parent_category_id)
        categories += separation + category.category_id;
    });
  return categories;
};

// ! NOT USED
export const AE_Affiliate_getCategoryById = async (category_id: number) => {
  const result = await execute(
    "affiliate",
    "aliexpress.affiliate.category.get",
    null
  );
  return result?.resp_result.result.categories.find(
    (category) => category.category_id === category_id
  );
};

// ! NOT USED
export const AE_Affiliate_featuredPromo = async (
  page_size?: number,
  page_no?: number,
  locale?: string
) =>
  await execute(
    "affiliate",
    "aliexpress.affiliate.featuredpromo.products.get",
    {
      fields: "shop_id", // "app_sale_price,shop_id",
      tracking_id: "reglinidz",
      page_size: page_size?.toString(),
      page_no: page_no?.toString(),
      target_language: locale?.toUpperCase(),
      target_currency: "USD",
    }
  );

// ! NOT USED
export const AE_Affiliate_getProductDetails = async (
  product_ids: string,
  locale?: string
) =>
  await execute("affiliate", "aliexpress.affiliate.productdetail.get", {
    product_ids,
    fields: "commission_rate,sale_price",
    country: "DZ",
    tracking_id: "reglinidz",
    target_currency: "USD",
    target_language: locale?.toUpperCase(),
  });

export const ALIEXPRESS = {
  ds: {
    searchProducts: AE_DS_searchProducts,
    product: AE_DS_getProduct,
    productDetails: AE_DS_getProductDetail,
    shipping: AE_DS_getShippingInfo,
    tracking: AE_DS_getTrackingInfo,
    createOrder: AE_DS_createOrder,
    getOrder: AE_DS_getOrder,
  },
  affiliate: {
    hotproducts: AE_Affiliate_Hotproducts,
    searchProducts: AE_Affiliate_Query_Products,
    productDetails: AE_Affiliate_getProductDetails,
    featuredPromo: AE_Affiliate_featuredPromo,
    categories: AE_Affiliate_getCategories,
    categoryById: AE_Affiliate_getCategoryById,
  },
};
