import { API_RESPONSE_MESSAGES } from "@config/general";
import { ae_affiliate_products, ae_shipping } from "./helpers";
import {
  API_AE_AFFILIATE_PRODUCTS_PARAMS,
  API_AE_DS_SHIPPING_PARAMS,
  API_AE_DS_TRACKING_PARAMS,
} from "@reglini-types/ae/pinky";

export const api_ae_ds_shipping = async ({
  method,
  product_id,
  quantity,
}: API_AE_DS_SHIPPING_PARAMS) => {
  try {
    const result = await method({ product_id, quantity: quantity ?? 1 });
    if (
      result &&
      result.result &&
      result.result.aeop_freight_calculate_result_for_buyer_d_t_o_list
    ) {
      const shipping = ae_shipping(
        result.result.aeop_freight_calculate_result_for_buyer_d_t_o_list
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
    if (response.result_success) {
      // const result: ZAE_Tracking = {
      //   isTrackingAvailable,
      //   packages,
      //   shippingAddress,
      // };
      return { success: true, result: response };
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
  categories_method,
  method,
  search,
  locale,
  page_no,
  page_size,
}: API_AE_AFFILIATE_PRODUCTS_PARAMS) => {
  try {
    const categories = await categories_method();
    const response = await method({
      search,
      category_ids: categories,
      page_size: page_size ?? 20,
      page_no: page_no ?? 1,
      locale: locale ?? "FR",
    });
    if (response && response.resp_result && response.resp_result.result) {
      const data = ae_affiliate_products(response.resp_result.result);
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
