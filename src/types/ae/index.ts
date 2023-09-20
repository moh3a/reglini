import type {
  AE_Currency,
  AE_Logistics_Status,
  AE_Order_Status,
  AE_Platform_Type,
} from "ae_sdk";

export interface DS_Product_Base_Info {
  product_id: number;
  category_id: number;
  subject: string;
  currency_code: AE_Currency;
  product_status_type: string;
  ws_display: string;
  ws_offline_date: string;
  gmt_create: string;
  gmt_modified: string;
  owner_member_seq_long: number;
  evaluation_count: string;
  avg_evaluation_rating: string;
  detail: string;
  mobile_detail: string;
}

export interface DS_Product_Shipping_Info {
  delivery_time: number;
  ship_to_country: string;
}

export interface DS_Product_Package_Info {
  package_type: boolean;
  package_length: number;
  package_height: number;
  package_width: number;
  gross_weight: string;
  base_unit?: number;
  product_unit?: number;
}

export interface DS_Product_Store_Info {
  store_id: number;
  store_name: string;
  item_as_described_rating: string;
  communication_rating: string;
  shipping_speed_rating: string;
}

export interface DS_Product_Id_Converter {
  main_product_id: number;
  sub_product_id: string;
}

export interface DS_Product_Multimedia_Videos {
  ali_member_id: number;
  media_id: number;
  media_status: string;
  media_type: string;
  poster_url: string;
}

export interface DS_Product_Multimedia {
  ae_video_dtos: DS_Product_Multimedia_Videos[];
  image_urls: string;
}

export interface DS_Product_SKU_Variation {
  sku_stock: boolean;
  sku_price: string;
  sku_code: string;
  ipm_sku_stock: number;
  id: string;
  currency_code: AE_Currency;
  aeop_s_k_u_propertys: DS_Product_SKU_Properties[];
  barcode: string;
  offer_sale_price: string;
  offer_bulk_sale_price: string;
  sku_bulk_order: number;
  sku_available_stock?: number;
  s_k_u_available_stock?: number;
}

export interface DS_Product_SKU_Properties {
  sku_property_id: number;
  sku_property_value: string;
  sku_property_name: string;
  property_value_id: number;
  property_value_id_long: number;
  property_value_definition_name?: string;
  sku_image?: string;
}

export interface DS_Product_Attributes {
  attr_name_id: number;
  attr_name: string;
  attr_value_id: number;
  attr_value: string;
  attr_value_unit?: string;
  attr_value_start?: string;
  attr_value_end?: string;
}

export interface DS_Product {
  ae_item_sku_info_dtos: DS_Product_SKU_Variation[];
  ae_item_properties: DS_Product_Attributes[];
  ae_item_base_info_dto: DS_Product_Base_Info;
  ae_multimedia_info_dto: DS_Product_Multimedia;
  package_info_dto: DS_Product_Package_Info;
  logistics_info_dto: DS_Product_Shipping_Info;
  ae_store_info: DS_Product_Store_Info;
  product_id_converter_result: DS_Product_Id_Converter;
}

/**
 *
 * ORDER API
 * NEW ORDER
 *
 */

export interface AE_Product_Item {
  logistics_service_name?: string | null;
  order_memo?: string | null;
  product_count: number | null;
  product_id: number;
  sku_attr?: string | null;
}

export interface AE_Logistics_Address {
  address: string;
  city?: string;
  contact_person?: string;
  country?: string;
  full_name?: string;
  mobile_no?: string;
  phone_country?: string;
  province?: string;
  zip?: string;
}

/**
 *
 * ORDER API
 * GET ORDER
 *
 */

export interface DS_Price {
  amount: string;
  currency_code: AE_Currency;
}

export interface DS_Product_Info {
  product_id: number;
  product_price: DS_Price;
  product_name: string;
  product_count: number;
}

export interface DS_Logistics_Info {
  logistics_no: string;
  logistics_service: string;
}

export interface DS_Store_Info {
  store_id: number;
  store_name: string;
  store_url: string;
}

export interface DS_Get_Order {
  gmt_create: string;
  order_status: AE_Order_Status;
  logistics_status: AE_Logistics_Status;
  order_amount: DS_Price;
  child_order_list: DS_Product_Info[];
  logistics_info_list: DS_Logistics_Info[];
  store_info: DS_Store_Info;
}

/**
 * SHIPPING API
 * PRODUCT SHIPPING INFO
 */

export interface DS_Freight_Info {
  amount: number;
  cent: number;
  currency_code: AE_Currency;
}

export interface DS_Shipping_Details {
  error_code: number;
  estimated_delivery_time: string;
  freight: DS_Freight_Info;
  service_name: string;
}

export type DS_Shipping_Info_Response =
  | {
      success: true;
      aeop_freight_calculate_result_for_buyer_d_t_o_list: DS_Shipping_Details[];
    }
  | {
      success: false;
      error_desc: string;
    };

export interface DS_Shipping_Info_Result {
  aliexpress_logistics_buyer_freight_calculate_response: {
    result: DS_Shipping_Info_Response;
  };
}

/**
 * TRACKING API
 * ORDER TRACKING INFO
 */

export interface DS_Tracking_Event {
  event_desc: string;
  signed_name: string;
  status: string;
  address: string;
  event_date: string;
}

export type DS_Tracking_Info_Response =
  | {
      result_success: true;
      details: DS_Tracking_Event[];
      official_website: string;
    }
  | {
      result_success: false;
      error_desc: string;
    };

export interface DS_Tracking_Info_Result {
  aliexpress_logistics_ds_trackinginfo_query_response: DS_Tracking_Info_Response;
}

/**
 * AFFILIATE API
 * PRODUCT DETAILS
 */

export interface Affiliate_Product_Promo_Code_Info {
  promo_code?: string;
  code_campaigntype?: string;
  code_value?: string;
  code_availabletime_start?: string;
  code_availabletime_end?: string;
  code_mini_spend?: string;
  code_quantity?: string;
  code_promotionurl?: string;
}

export interface Affiliate_Base_Product_Details {
  app_sale_price?: string;
  app_sale_price_currency?: AE_Currency;
  commission_rate?: string;
  discount?: string;
  evaluate_rate?: string;
  first_level_category_id?: number;
  first_level_category_name?: string;
  hot_product_commission_rate?: string;
  lastest_volume?: number;
  original_price?: string;
  original_price_currency?: AE_Currency;
  platform_product_type?: AE_Platform_Type;
  product_detail_url?: string;
  product_id?: number;
  product_main_image_url?: string;
  product_small_image_urls?: string[];
  product_title?: string;
  product_video_url?: string;
  promotion_link?: string;
  promo_code_info: Affiliate_Product_Promo_Code_Info;
  relevant_market_commission_rate: string;
  sale_price: string;
  sale_price_currency: AE_Currency;
  second_level_category_id: number;
  second_level_category_name: string;
  shop_id: number;
  shop_url: string;
  target_app_sale_price: string;
  target_original_price: string;
  target_sale_price: string;
  target_original_price_currency: AE_Currency;
  target_sale_price_currency: AE_Currency;
  target_app_sale_price_currency: AE_Currency;
}

export interface Affiliate_Product_Details
  extends Affiliate_Base_Product_Details {
  ship_to_days?: string;
}

export interface Affiliate_Products {
  current_page_no: number;
  current_record_count: number;
  products: Affiliate_Product_Details[];
  total_page_no: number;
  total_record_count: number;
}

export interface Affiliate_Products_Response {
  resp_result: {
    resp_code: number;
    resp_msg: string;
    result: Affiliate_Products;
  };
}

export interface Affiliate_Products_Result {
  aliexpress_affiliate_product_query_response: Affiliate_Products_Response;
}
