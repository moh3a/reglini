import { AxiosError } from "axios";

import { API_RESPONSE_MESSAGES } from "@config/general";
import {
  API_ZAPIEX_PRODUCT_PARAMS,
  API_ZAPIEX_PRODUCT_SEARCH_PARAMS,
} from "@reglini-types/zapiex/pinky";

export const api_zapiex_product = async ({
  method,
  id,
  locale,
}: API_ZAPIEX_PRODUCT_PARAMS) => {
  try {
    const data = await method({ id, locale });
    if (data)
      return {
        success: true,
        data,
      };
    else
      return {
        success: false,
        error: API_RESPONSE_MESSAGES.ZAPIEX_PRODUCT_DETAILS_FAIL,
      };
  } catch (error) {
    if (error instanceof AxiosError) console.error(error.response?.data);
    else console.error(error);
    return {
      success: false,
      error: API_RESPONSE_MESSAGES.ZAPIEX_PRODUCT_DETAILS_ERROR,
    };
  }
};

export const api_zapiex_product_search = async ({
  method,
  text,
  locale,
  page,
}: API_ZAPIEX_PRODUCT_SEARCH_PARAMS) => {
  try {
    const data = await method({
      text,
      locale,
      page,
    });
    if (data) return { success: true, data };
    else
      return {
        success: false,
        error: API_RESPONSE_MESSAGES.ZAPIEX_SEARCH_PRODUCTS_FAIL,
      };
  } catch (error) {
    if (error instanceof AxiosError) console.error(error.response?.data);
    else console.error(error);
    return {
      success: false,
      error: API_RESPONSE_MESSAGES.ZAPIEX_SEARCH_PRODUCTS_ERROR,
    };
  }
};
