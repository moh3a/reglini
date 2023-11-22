import type { AE_Language, Result } from "ae_sdk";

import type {
  Affiliate_Products_Result,
  Affiliate_Smart_Match_Products_Result,
  DS_Freight_Calculation_Result,
  DS_Tracking_Info_Result,
} from ".";

export interface API_AE_DS_SHIPPING_ARGUMENTS {
  product_id: number;
  sku: string;
  quantity?: number;
}

export interface API_AE_DS_SHIPPING_PARAMS
  extends API_AE_DS_SHIPPING_ARGUMENTS {
  method: (
    args: API_AE_DS_SHIPPING_ARGUMENTS,
  ) => Result<DS_Freight_Calculation_Result>;
}

export interface API_AE_DS_TRACKING_ARGUMENTS {
  order_id: string;
  tracking_id: string;
  service_name: string;
}

export interface API_AE_DS_TRACKING_PARAMS
  extends API_AE_DS_TRACKING_ARGUMENTS {
  method: (
    args: API_AE_DS_TRACKING_ARGUMENTS,
  ) => Result<DS_Tracking_Info_Result>;
}

export interface API_AE_AFFILIATE_PRODUCTS_ARGUMENTS {
  search?: string;
  category_ids?: string | undefined;
  page_size?: number | undefined;
  page_no?: number | undefined;
  locale?: string | undefined;
}

export interface API_AE_AFFILIATE_PRODUCTS_PARAMS
  extends API_AE_AFFILIATE_PRODUCTS_ARGUMENTS {
  method: (
    args: API_AE_AFFILIATE_PRODUCTS_ARGUMENTS,
  ) => Result<Affiliate_Products_Result>;
}

export interface API_AE_AFFILIATE_SMARTMATCHPRODUCTS_ARGUMENTS {
  product_id: string;
  target_language?: AE_Language;
}

export interface API_AE_AFFILIATE_SMARTMATCHPRODUCTS_PARAMS
  extends API_AE_AFFILIATE_SMARTMATCHPRODUCTS_ARGUMENTS {
  method: (
    args: API_AE_AFFILIATE_SMARTMATCHPRODUCTS_ARGUMENTS,
  ) => Result<Affiliate_Smart_Match_Products_Result>;
}
