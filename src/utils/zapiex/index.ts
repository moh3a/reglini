import axios from "axios";
import { config } from "dotenv";
config();

import type { AEProduct } from "@reglini-types/index";
import type {
  ZAE_Order,
  ZAE_Product,
  ZAE_Search,
  ZAE_ShippingAddres,
  ZAE_Tracking,
} from "@reglini-types/zapiex";
import { parse_locale } from "..";
import {
  API_ZAPIEX_PRODUCT_ARGUMENTS,
  API_ZAPIEX_PRODUCT_SEARCH_ARGUMENTS,
} from "@reglini-types/zapiex/pinky";

export const ZAE_getProductById = async ({
  id,
  locale,
}: API_ZAPIEX_PRODUCT_ARGUMENTS) => {
  const { data } = await axios({
    method: "post",
    url: "https://api.zapiex.com/v3/product/details",
    data: {
      productId: id,
      currency: "EUR",
      shipTo: "DZ",
      locale: parse_locale(locale),
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

export const ZAE_SearchProduct = async ({
  text,
  locale,
  page,
}: API_ZAPIEX_PRODUCT_SEARCH_ARGUMENTS) => {
  const { data } = await axios({
    method: "post",
    url: "https://api.zapiex.com/v3/search",
    data: {
      text,
      locale: parse_locale(locale),
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
  const res = await axios.post(
    "https://api.zapiex.com/v3/order/create",
    {
      username: process.env.ALIEXPRESS_USERNAME,
      password: process.env.ALIEXPRESS_PASSWORD,
      currency: "EUR",
      products,
      shippingAddress,
    },
    {
      headers: {
        "x-api-key": process.env.ZAPIEX_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data as {
    statusCode: number;
    data: {
      orderIds?: string[];
      errorType?: string;
      errorMessage?: string;
      trace?: any[];
    };
  };
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
  try {
    const { data } = await axios.post(
      "https://api.zapiex.com/v3/order/cancel",
      {
        username: process.env.ALIEXPRESS_USERNAME,
        password: process.env.ALIEXPRESS_PASSWORD,
        orderId: id,
      },
      {
        headers: {
          "x-api-key": process.env.ZAPIEX_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Encoding": "application/json",
        },
      }
    );
    console.log(data);
  } catch (error) {
    console.log(error);
  }
  return { success: false };
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
