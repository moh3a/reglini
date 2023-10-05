import axios from "axios";

import type { ZAE_Product, ZAE_Search } from "~/types/zapiex";
import { parse_locale } from "..";
import type {
  API_ZAPIEX_PRODUCT_ARGUMENTS,
  API_ZAPIEX_PRODUCT_SEARCH_ARGUMENTS,
} from "~/types/zapiex/pinky";
import { env } from "~/env.mjs";

export const ZAE_getProductById = async ({
  id,
  locale,
}: API_ZAPIEX_PRODUCT_ARGUMENTS) => {
  const { data } = await axios({
    method: "post",
    url: "https://api.zapiex.com/v3/product/details",
    data: {
      productId: id,
      currency: "USD",
      shipTo: "DZ",
      locale: parse_locale(locale),
      shipFrom: "CN",
      getHtmlDescription: true,
      getShipping: true,
      getSellerDetails: true,
    },
    headers: {
      "x-api-key": env.ZAPIEX_KEY,
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
      currency: "USD",
      shipFrom: "CN",
      shipTo: "DZ",
    },
    headers: {
      "x-api-key": env.ZAPIEX_KEY,
    },
  });
  return data.data as ZAE_Search;
};

export const ZAE_CancelOrder = async (id: string) => {
  try {
    const { data } = await axios.post(
      "https://api.zapiex.com/v3/order/cancel",
      {
        username: env.ALIEXPRESS_USERNAME,
        password: env.ALIEXPRESS_PASSWORD,
        orderId: id,
      },
      {
        headers: {
          "x-api-key": env.ZAPIEX_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Encoding": "application/json",
        },
      },
    );
    console.log(data);
  } catch (error) {
    console.log(error);
  }
  return { success: false };
};

export const ZAPIEX = {
  getProductById: ZAE_getProductById,
  searchProducts: ZAE_SearchProduct,
  cancelOrder: ZAE_CancelOrder,
};
