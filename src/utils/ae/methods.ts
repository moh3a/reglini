import { API_RESPONSE_MESSAGES } from "@config/general";
import { ae_affiliate_products, ae_shipping } from "./convert_to_zapiex";
import {
  API_AE_AFFILIATE_PRODUCTS_PARAMS,
  API_AE_DS_SHIPPING_PARAMS,
  API_AE_DS_TRACKING_PARAMS,
} from "@reglini-types/ae/pinky";
import { DEFAULT_PAGE_SIZE } from "@config/constants";
import { shuffle } from "..";

export const api_ae_ds_shipping = async ({
  method,
  product_id,
  quantity,
}: API_AE_DS_SHIPPING_PARAMS) => {
  try {
    const result = await method({ product_id, quantity: quantity ?? 1 });

    if (
      result.ok &&
      result.data.aliexpress_logistics_buyer_freight_calculate_response.result
        .success &&
      result.data.aliexpress_logistics_buyer_freight_calculate_response.result
        .aeop_freight_calculate_result_for_buyer_d_t_o_list
    ) {
      const shipping = ae_shipping(
        result.data.aliexpress_logistics_buyer_freight_calculate_response.result
          .aeop_freight_calculate_result_for_buyer_d_t_o_list
      );
      return { success: true, data: shipping };
    } else
      return {
        success: false,
        error: API_RESPONSE_MESSAGES.AE_DS_PRODUCT_SHIPPING_DETAILS_FAIL,
      };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: API_RESPONSE_MESSAGES.AE_DS_PRODUCT_SHIPPING_DETAILS_ERROR,
    };
  }
};

export const api_ae_ds_tracking = async ({
  method,
  order_id,
  service_name,
  tracking_id,
}: API_AE_DS_TRACKING_PARAMS) => {
  try {
    const response = await method({ order_id, tracking_id, service_name });
    console.log(response);

    if (
      response.ok &&
      response.data.aliexpress_logistics_ds_trackinginfo_query_response
        .result_success
    ) {
      return {
        success: true,
        result:
          response.data.aliexpress_logistics_ds_trackinginfo_query_response,
      };
    } else
      return {
        success: false,
        error: API_RESPONSE_MESSAGES.AE_DS_PRODUCT_TRACKING_INFO_FAIL,
      };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: API_RESPONSE_MESSAGES.AE_DS_PRODUCT_TRACKING_INFO_ERROR,
    };
  }
};

export const api_ae_affiliate_products = async ({
  method,
  search,
  locale,
  page_no,
  page_size,
}: API_AE_AFFILIATE_PRODUCTS_PARAMS) => {
  try {
    const response = await method({
      search,
      category_ids: shuffle([
        2, 3, 6, 7, 13, 18, 21, 26, 30, 36, 44, 66, 322, 509, 1511, 1524,
        200000345, 200000343, 200574005, 200000532, 201768104,
      ]).join(","),
      page_size: page_size ?? DEFAULT_PAGE_SIZE,
      page_no: page_no ?? 1,
      locale: locale ?? "FR",
    });

    if (
      response.ok &&
      response.data.aliexpress_affiliate_product_query_response.resp_result &&
      response.data.aliexpress_affiliate_product_query_response.resp_result
        .result
    ) {
      const data = ae_affiliate_products(
        response.data.aliexpress_affiliate_product_query_response.resp_result
          .result
      );
      return { success: true, data };
    } else
      return {
        success: false,
        error: API_RESPONSE_MESSAGES.AE_AFFILIATE_SEARCH_PRODUCTS_FAIL,
      };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: API_RESPONSE_MESSAGES.AE_AFFILIATE_SEARCH_PRODUCTS_ERROR,
    };
  }
};
