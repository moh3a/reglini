import axios from "axios";
import { config } from "dotenv";
config();

import { AEProduct } from "@reglini-types/index";
import {
  ZAE_Order,
  ZAE_Product,
  ZAE_Search,
  ZAE_ShippingAddres,
  ZAE_Tracking,
} from "@reglini-types/zapiex";

const parseLocale = (locale?: string | null) => {
  if (locale) {
    if (locale.toLowerCase() === "en") {
      locale = "en_US";
    }
    if (locale.toLowerCase() === "fr") {
      locale = "fr_FR";
    }
    if (locale.toLowerCase() === "ar") {
      locale = "ar_MA";
    }
  } else locale = "en_US";
  return locale;
};

export const ZAE_getProductById = async (
  id: string,
  locale?: string | null
) => {
  const { data } = await axios({
    method: "post",
    url: "https://api.zapiex.com/v3/product/details",
    data: {
      productId: id,
      currency: "EUR",
      shipTo: "DZ",
      locale: parseLocale(locale),
      shipFrom: "CN",
      getHtmlDescription: true,
      getShipping: true,
      getSellerDetails: true,
    },
    headers: {
      "x-api-key": process.env.ZAPIEX_KEY,
    },
  });
  return data.data as ZAE_Product;
};

export const ZAE_SearchProduct = async (
  text: string,
  locale?: string | null,
  page?: number | null
) => {
  const { data } = await axios({
    method: "post",
    url: "https://api.zapiex.com/v3/search",
    data: {
      text,
      locale: parseLocale(locale),
      page,
      moreThanFourStarsOnly: true,
      sort: "BEST_MATCH",
      currency: "EUR",
      shipFrom: "CN",
      shipTo: "DZ",
    },
    headers: {
      "x-api-key": process.env.ZAPIEX_KEY,
    },
  });
  return data.data as ZAE_Search;
};

export const ZAE_CreateOrder = async (
  products: AEProduct[],
  shippingAddress: ZAE_ShippingAddres
) => {
  const { data } = await axios({
    method: "post",
    url: "https://api.zapiex.com/v3/order/create",
    headers: {
      "x-api-key": process.env.ZAPIEX_KEY,
      "Content-Type": "application/json",
    },
    data: {
      username: process.env.ALIEXPRESS_USERNAME,
      password: process.env.ALIEXPRESS_PASSWORD,
      currency: "EUR",
      products,
      shippingAddress,
    },
  });
  return data.data as { orderIds: string[] };
};

export const ZAE_GetOrder = async (id: string) => {
  const { data } = await axios({
    method: "post",
    url: "https://api.zapiex.com/v3/order/details",
    headers: {
      "x-api-key": process.env.ZAPIEX_KEY,
      "Content-Type": "application/json",
    },
    data: {
      username: process.env.ALIEXPRESS_USERNAME,
      password: process.env.ALIEXPRESS_PASSWORD,
      orderId: id,
    },
  });
  return data.data as ZAE_Order;
};

export const ZAE_CancelOrder = async (id: string) => {
  const { data } = await axios({
    method: "post",
    url: "https://api.zapiex.com/v3/order/cancel",
    headers: {
      "x-api-key": process.env.ZAPIEX_KEY,
      "Content-Type": "application/json",
    },
    data: {
      username: process.env.ALIEXPRESS_USERNAME,
      password: process.env.ALIEXPRESS_PASSWORD,
      orderId: id,
    },
  });
  return data.data as { success: boolean };
};

export const ZAE_TrackingOrder = async (id: string) => {
  const { data } = await axios({
    method: "post",
    url: "https://api.zapiex.com/v3/order/tracking",
    headers: {
      "x-api-key": process.env.ZAPIEX_KEY,
      "Content-Type": "application/json",
    },
    data: {
      username: process.env.ALIEXPRESS_USERNAME,
      password: process.env.ALIEXPRESS_PASSWORD,
      orderId: id,
    },
  });
  return data.data as ZAE_Tracking;
};

export const ZAPIEX = {
  getProductById: ZAE_getProductById,
  searchProducts: ZAE_SearchProduct,
  createOrder: ZAE_CreateOrder,
  cancelOrder: ZAE_CancelOrder,
  getOrder: ZAE_GetOrder,
  trackingOrder: ZAE_TrackingOrder,
};
