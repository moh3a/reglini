import {
  DropshipperClient,
  AffiliateClient,
  type AE_Currency,
  type AE_Language,
} from "ae_sdk";

import type {
  API_AE_AFFILIATE_PRODUCTS_ARGUMENTS,
  API_AE_AFFILIATE_SMARTMATCHPRODUCTS_ARGUMENTS,
  API_AE_DS_SHIPPING_ARGUMENTS,
  API_AE_DS_TRACKING_ARGUMENTS,
} from "~/types/ae/pinky";
import type { AE_Logistics_Address, AE_Product_Item } from "~/types/ae";
import { shuffle } from "..";
import { env } from "~/env.mjs";
import {
  AE_TRACKING_ID,
  AE_USER_ID,
  DEFAULT_COUNTRY_SHIPPED_TO,
  DEFAULT_PRICE_CURRENCY,
} from "~/config/constants";

const ds_client = new DropshipperClient({
  app_key: env.ALIEXPRESS_DS_APP_KEY,
  app_secret: env.ALIEXPRESS_DS_APP_SECRET,
  session: env.ALIEXPRESS_DS_ACCESS_TOKEN,
});

const affiliate_client = new AffiliateClient({
  app_key: env.ALIEXPRESS_AFFILIATE_APP_KEY,
  app_secret: env.ALIEXPRESS_AFFILIATE_APP_SECRET,
  session: env.ALIEXPRESS_AFFILIATE_ACCESS_TOKEN,
});

export const AE_DS_getProduct = async (
  product_id: number,
  ship_to_country?: string,
  target_currency?: AE_Currency,
  target_language?: AE_Language,
) =>
  await ds_client.productDetails({
    product_id,
    ship_to_country,
    target_currency,
    target_language,
  });

export const AE_DS_getShippingInfo = async ({
  product_id,
  quantity,
  sku,
}: API_AE_DS_SHIPPING_ARGUMENTS) =>
  await ds_client.freightInfo({
    country_code: DEFAULT_COUNTRY_SHIPPED_TO,
    product_id,
    product_num: quantity ?? 1,
    send_goods_country_code: "CN",
    price_currency: DEFAULT_PRICE_CURRENCY,
    sku_id: sku,
  });

export const AE_DS_getTrackingInfo = async ({
  order_id,
  tracking_id,
  service_name,
}: API_AE_DS_TRACKING_ARGUMENTS) =>
  await ds_client.trackingInfo({
    origin: "ESCROW",
    to_area: DEFAULT_COUNTRY_SHIPPED_TO,
    out_ref: order_id,
    logistics_no: tracking_id,
    service_name,
  });

export const AE_DS_createOrder = async (
  logistics_address: AE_Logistics_Address,
  product_items: AE_Product_Item[],
) =>
  await ds_client.createOrder({
    logistics_address,
    product_items,
  });

export const AE_DS_getOrder = async (order_id: number) =>
  await ds_client.orderDetails({
    order_id,
  });

export const AE_Affiliate_Query_Products = async ({
  search,
  category_ids,
  page_size,
  page_no,
  locale,
}: API_AE_AFFILIATE_PRODUCTS_ARGUMENTS) =>
  await affiliate_client.queryProducts({
    keywords: search,
    category_ids,
    fields: "commission_rate,sale_price",
    page_no: page_no?.toString(),
    page_size: page_size?.toString(),
    platform_product_type: "ALL",
    target_currency: DEFAULT_PRICE_CURRENCY,
    target_language: locale?.toUpperCase() as AE_Language,
    tracking_id: AE_TRACKING_ID,
    ship_to_country: DEFAULT_COUNTRY_SHIPPED_TO,
    sort: "LAST_VOLUME_DESC",
  });

// ! NOT USED
export const AE_Affiliate_Hotproducts = async ({
  search,
  category_ids,
  page_size,
  page_no,
  locale,
}: API_AE_AFFILIATE_PRODUCTS_ARGUMENTS) => {
  const result = await affiliate_client.getHotProducts({
    category_ids,
    fields: "commission_rate,sale_price",
    keywords: search,
    page_no: page_no?.toString(),
    page_size: page_size?.toString(),
    platform_product_type: "ALL",
    target_currency: DEFAULT_PRICE_CURRENCY,
    target_language: locale?.toUpperCase() as AE_Language,
    tracking_id: AE_TRACKING_ID,
    ship_to_country: "DZ",
  });
  return result;
};

export const AE_Affiliate_getCategories = async () => {
  const result = await affiliate_client.getCategories({});
  let categories = "";
  if (result.ok) {
    const data =
      result.data.aliexpress_affiliate_category_get_response.resp_result.result;
    if (data && data.categories.length > 0) {
      shuffle(data.categories).forEach((category) => {
        const separation = categories ? "," : "";
        if (!category.parent_category_id)
          categories += separation + category.category_id;
      });
    }
  }
  return categories;
};

export const AE_Affiliate_smartMatchProducts = async ({
  product_id,
  target_language,
}: API_AE_AFFILIATE_SMARTMATCHPRODUCTS_ARGUMENTS) =>
  await affiliate_client.smartMatchProducts({
    device_id: "adid",
    country: DEFAULT_COUNTRY_SHIPPED_TO,
    page_no: 1,
    product_id,
    target_currency: DEFAULT_PRICE_CURRENCY,
    target_language,
    tracking_id: AE_TRACKING_ID,
    user: AE_USER_ID,
  });

export const AE_Affiliate_featuredPromos = async () =>
  await affiliate_client.featuredPromoInfo({});

export const ALIEXPRESS = {
  ds: {
    product: AE_DS_getProduct,
    shipping: AE_DS_getShippingInfo,
    tracking: AE_DS_getTrackingInfo,
    createOrder: AE_DS_createOrder,
    getOrder: AE_DS_getOrder,
  },
  affiliate: {
    hotproducts: AE_Affiliate_Hotproducts,
    searchProducts: AE_Affiliate_Query_Products,
    categories: AE_Affiliate_getCategories,
    smartMatch: AE_Affiliate_smartMatchProducts,
    featuredPromos: AE_Affiliate_featuredPromos,
  },
};
