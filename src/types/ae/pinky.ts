import {
  Affiliate_Products_Result,
  DS_ShippingAPI_Shipping_Info_Result,
  DS_ShippingAPI_Tracking_Info_Result,
} from ".";

export interface API_AE_DS_SHIPPING_ARGUMENTS {
  product_id: number;
  quantity?: number;
}

export interface API_AE_DS_SHIPPING_PARAMS
  extends API_AE_DS_SHIPPING_ARGUMENTS {
  method: (
    args: API_AE_DS_SHIPPING_ARGUMENTS
  ) => Promise<DS_ShippingAPI_Shipping_Info_Result | undefined>;
}

export interface API_AE_DS_TRACKING_ARGUMENTS {
  order_id: string;
  tracking_id: string;
  service_name: string;
}

export interface API_AE_DS_TRACKING_PARAMS
  extends API_AE_DS_TRACKING_ARGUMENTS {
  method: (
    args: API_AE_DS_TRACKING_ARGUMENTS
  ) => Promise<DS_ShippingAPI_Tracking_Info_Result | undefined>;
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
    args: API_AE_AFFILIATE_PRODUCTS_ARGUMENTS
  ) => Promise<Affiliate_Products_Result | undefined>;
  categories_method: () => Promise<string>;
}
