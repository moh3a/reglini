import { config } from "dotenv";
config();

import { promisify } from "util";
import { AE_getShippingInfo } from "@utils/ae";

export type AE_Function_Return_Type<T> = {
  response: T | null | undefined;
  error: IAEError | null | undefined;
};

// export const AE_findProductDetailsById = async (
//   id: string,
//   locale?: string | null
// ): Promise<IDropshipperProductDetails> => {
//   const AE_DS_Client_Execute = promisify<
//     string,
//     any,
//     IDropshipperProductDetails
//   >(AE_DS_Client.execute);
//   const data = await AE_DS_Client_Execute(
//     "aliexpress.postproduct.redefining.findaeproductbyidfordropshipper",
//     {
//       session: process.env.ALIEXPRESS_DS_ACCESS_TOKEN,
//       local_country: "DZ",
//       local_language: locale,
//       product_id: id,
//     }
//   );
//   return data;
// };

// export const AE_getShippingInfo = async (
//   id: string
// ): Promise<AE_Function_Return_Type<IShippingInformation>> => {
//   let error: IAEError | null | undefined = undefined;
//   let response: IShippingInformation | null | undefined = undefined;

//   AE_DS_Client.execute(
//     "aliexpress.logistics.buyer.freight.calculate",
//     {
//       session: process.env.ALIEXPRESS_DS_ACCESS_TOKEN,
//       param_aeop_freight_calculate_for_buyer_d_t_o: `{"country_code": "DZ","product_id": "${id}","product_num": 1,"send_goods_country_code": "CN","price_currency": "USD"}`,
//     },
//     (cberror: IAEError, cbresponse: IShippingInformation) => {
//       error = cberror ?? null;
//       response = cbresponse ?? null;
//     }
//   );
//   return { response, error };
// };

// export const AE_findProductById = async (
//   id: string,
//   locale?: string | null
// ): Promise<AE_Function_Return_Type<IAEAffiliateProductDetailsResponse>> => {
//   let error: IAEError | null | undefined = undefined;
//   let response: IAEAffiliateProductDetailsResponse | null | undefined =
//     undefined;

//   AE_Affiliate_Client.execute(
//     "aliexpress.affiliate.productdetail.get",
//     {
//       fields: "commission_rate,sale_price",
//       product_ids: id,
//       target_currency: "USD",
//       target_language: locale ? locale.toUpperCase() : "FR",
//       tracking_id: "reglinidz",
//       country: "DZ",
//     },
//     (cberror: IAEError, cbresponse: IAEAffiliateProductDetailsResponse) => {
//       error = cberror ?? null;
//       response = cbresponse ?? null;
//     }
//   );
//   return { response, error };
// };

// export const Aliexpress = {
//   ds: { shipping: AE_getShippingInfo, productById: AE_findProductDetailsById },
//   affiliate: { productById: AE_findProductById },
// };

export interface IDropshipperProductDetails {
  result: {
    aeop_freight_calculate_result_for_buyer_d_t_o_list: IShippingInformation;
    aeop_ae_product_s_k_us: {
      aeop_ae_product_sku: [
        {
          sku_stock: boolean;
          sku_price: string;
          sku_code: string;
          ipm_sku_stock: number;
          id: string;
          currency_code: string;
          aeop_s_k_u_propertys: {
            aeop_sku_property: [
              {
                sku_property_id: number;
                sku_image: string;
                property_value_id_long: number;
                property_value_definition_name: string;
                sku_property_value: string;
                sku_property_name: string;
              }
            ];
          };
          barcode: string;
          offer_sale_price: string;
          offer_bulk_sale_price: string;
          sku_bulk_order: number;
          s_k_u_available_stock: number;
        }
      ];
    };
    detail: string;
    is_success: boolean;
    product_unit: number;
    ws_offline_date: string;
    ws_display: string;
    category_id: number;
    aeop_a_e_multimedia: {
      aeop_a_e_videos: {
        aeop_ae_video: [
          {
            poster_url: string;
            media_type: string;
            media_status: string;
            media_id: number;
            ali_member_id: number;
          }
        ];
      };
    };
    owner_member_id: string;
    product_status_type: string;
    properties: IProductProperties[];
    price: IProductPrice;
    aeop_ae_product_propertys: {
      aeop_ae_product_property: [
        {
          attr_value_unit: string;
          attr_value_start: string;
          attr_value_id: number;
          attr_value_end: string;
          attr_value: string;
          attr_name_id: number;
          attr_name: string;
        }
      ];
    };
    gross_weight: string;
    delivery_time: number;
    ws_valid_num: number;
    gmt_modified: string;
    error_message: string;
    package_type: boolean;
    aeop_national_quote_configuration: {
      configuration_type: string;
      configuration_data: string;
    };
    subject: string;
    base_unit: number;
    package_length: number;
    mobile_detail: string;
    package_height: number;
    package_width: number;
    currency_code: string;
    gmt_create: string;
    image_u_r_ls: string;
    product_id: number;
    error_code: number;
    product_price: string;
    item_offer_site_sale_price: string;
    total_available_stock: number;
    store_info: {
      communication_rating: string;
      item_as_descriped_rating: string;
      shipping_speed_rating: string;
      store_id: number;
      store_name: string;
    };
    evaluation_count: number;
    avg_evaluation_rating: string;
    order_count: number;
  };
  rsp_msg: string;
  rsp_code: string;
}

export interface IBasicProductDetails {
  result: {
    aeop_freight_calculate_result_for_buyer_d_t_o_list: IShippingInformation;
    ae_item_base_info_dto?: {
      product_id?: number;
      category_id?: number;
      subject?: string;
      currency_code?: string;
      product_status_type?: string;
      ws_display?: string;
      ws_offline_date?: string;
      gmt_create?: string;
      gmt_modified?: string;
      owner_member_seq_long?: number;
      evaluation_count?: string;
      avg_evaluation_rating?: string;
      detail?: string;
      mobile_detail?: string;
    };
    ae_item_sku_info_dtos?: {
      ae_item_sku_info_d_t_o?: [
        {
          id?: string;
          sku_stock?: boolean;
          sku_price?: string;
          sku_code?: string;
          ipm_sku_stock?: number;
          currency_code?: string;
          ae_sku_property_dtos?: {
            ae_sku_property_d_t_o?: [
              {
                sku_property_id?: number;
                sku_property_name?: string;
                sku_property_value?: string;
                property_value_id?: number;
                property_value_definition_name?: string;
                sku_image?: string;
              }
            ];
          };
          barcode?: string;
          offer_sale_price?: string;
          offer_bulk_sale_price?: string;
          sku_bulk_order?: number;
          sku_available_stock?: number;
        }
      ];
    };
    ae_multimedia_info_dto?: {
      ae_video_dtos?: {
        ae_video_d_t_o?: [
          {
            ali_member_id?: number;
            media_id?: number;
            media_status?: string;
            media_type?: string;
            poster_url?: string;
          }
        ];
      };
      image_urls?: string;
    };
    package_info_dto?: {
      package_length?: number;
      package_height?: number;
      package_width?: number;
      gross_weight?: string;
      base_unit?: number;
      package_type?: true;
      product_unit?: number;
    };
    logistics_info_dto?: {
      delivery_time?: number;
      ship_to_country?: string;
    };
    ae_item_properties?: {
      logistics_info_d_t_o?: [
        {
          attr_name_id?: number;
          attr_name?: string;
          attr_value_id?: number;
          attr_value?: string;
          attr_value_start?: string;
          attr_value_end?: string;
          attr_value_unit?: string;
        }
      ];
    };
    ae_store_info?: {
      store_id?: number;
      store_name?: string;
      item_as_described_rating?: string;
      communication_rating?: string;
      shipping_speed_rating?: string;
    };
    properties: IProductProperties[];
  };
  rsp_msg: string;
  rsp_code: string;
}

export interface IProductProperties {
  id?: string;
  name?: string;
  values: [
    {
      id?: string;
      name?: string;
      hasImage?: boolean;
      imageUrl?: string;
      thumbnailImageUrl?: string;
    }
  ];
}

export interface IProductPrice {
  hasDiscount: boolean;
  discount?: number;
  discountedPrice?: { min: number; max?: number };
  originalPrice: { min: number; max?: number };
}

export interface IShippingInformation {
  aeop_freight_calculate_result_for_buyer_dto: [
    {
      error_code: number;
      estimated_delivery_time: string;
      freight: {
        amount: number;
        cent: number;
        currency_code: string;
      };
      service_name: string;
    }
  ];
}

export interface IShippingInformationResponse {
  aeop_freight_calculate_result_for_buyer_d_t_o_list: {
    aeop_freight_calculate_result_for_buyer_dto: [
      {
        error_code: number;
        estimated_delivery_time: string;
        freight: {
          amount: string;
          cent: number;
          currency_code: string;
        };
        service_name: number;
      }
    ];
  };
  error_desc: string;
  success: boolean;
}

export interface IAEAffiliateProductsResponse {
  resp_result: {
    resp_code: number;
    resp_msg: string;
    result: IAEAffiliateProductsResult;
  };
}

export interface IAEAffiliateProductDetailsResponse {
  resp_result: {
    resp_code: number;
    resp_msg: string;
    result: IAEAffiliateProductDetailsResult;
  };
}

export interface IAEAffiliateProductsResult {
  current_page_no: number;
  current_record_count: number;
  products: {
    product: [IAffiliateProduct];
  };
  total_page_no: number;
  total_record_count: number;
}

export interface IAEAffiliateProductDetailsResult {
  current_record_count: number;
  products: {
    product: [IAffiliateProduct];
  };
}

export interface IAffiliateProduct {
  ds_product_details: IDropshipperProductDetails["result"];
  app_sale_price?: string;
  app_sale_price_currency?: string;
  commission_rate?: string;
  discount?: string;
  evaluate_rate?: string;
  first_level_category_id?: number;
  first_level_category_name?: string;
  lastest_volume?: number;
  hot_product_commission_rate?: string;
  original_price?: string;
  original_price_currency?: string;
  platform_product_type?: "TMALL" | "ALL" | "PLAZA";
  product_detail_url?: string;
  product_id?: number;
  product_main_image_url?: string;
  product_small_image_urls?: {
    string: [string];
  };
  product_title?: string;
  product_video_url?: string;
  promotion_link?: string;
  sale_price?: string;
  sale_price_currency?: string;
  second_level_category_id?: number;
  second_level_category_name?: string;
  shop_id?: number;
  shop_url?: string;
  target_app_sale_price?: string;
  target_app_sale_price_currency?: string;
  target_original_price?: string;
  target_original_price_currency?: string;
  target_sale_price?: string;
  target_sale_price_currency?: string;
  relevant_market_commission_rate?: string;
  promo_code_info?: {
    promo_code?: string;
    code_campaigntype?: string;
    code_value?: string;
    code_availabletime_start?: string;
    code_availabletime_end?: string;
    code_mini_spend?: string;
    code_quantity?: string;
    code_promotionurl?: string;
  };
  ship_to_days?: string;
}

export interface IAEError {
  msg: string;
  code: number;
  sub_msg: string;
  sub_code: string;
}

export interface IAEOrderTrackingResponse {
  details: IAEOrderTracking["details"];
  official_website: IAEOrderTracking["official_website"];
  error_desc: string;
  result_success: boolean;
}

export interface IAEOrderTracking {
  details: {
    details: [
      {
        event_desc: string;
        signed_name: string;
        status: string;
        address: string;
        event_date: string;
      }
    ];
  };
  official_website: string;
}

export interface IAEOrderDetails {
  orderId: string;
  createdAt: string;
  product: {
    productId: string;
    name: string;
    sku: string;
    price: number;
    shippingPrice: number;
    totalPrice: number;
    imageUrl: string;
    properties: any;
    quantity: number;
    carrierId: string;
    orderMemo: string;
  };
  shippingAddress: {
    name: string;
    countryCode: string;
    city: string;
    zipCode: string;
    addressLine1: string;
    phoneCountry: string;
    mobilePhone: string;
    province: string;
  };
  details: {
    gmt_create: string;
    order_status: string;
    logistics_status: string;
    order_amount: {
      amount: string;
      currency_code: string;
    };
    child_order_list: {
      aeop_child_order_info: [
        {
          product_id: number;
          product_price: {
            amount: string;
            currency_code: string;
          };
          product_name: string;
          product_count: number;
        }
      ];
    };
    logistics_info_list: {
      ae_order_logistics_info: [
        {
          logistics_no: string;
          logistics_service: string;
        }
      ];
    };
    store_info: {
      store_id: number;
      store_name: string;
      store_url: string;
    };
  };
  tracking: {
    hasTracking: boolean;
    details: [
      {
        event_desc: string;
        signed_name: string;
        status: string;
        address: string;
        event_date: string;
      }
    ];
    official_website: string;
  };
  payment: {
    hasTimedOut: boolean;
    isPaymentConfirmed: boolean;
    wasDeclined: boolean;
    receipt: string;
    paymentMethod: string;
    paymentTime: string;
  };
  packageReceived: {
    wasReceived: boolean;
    packagePicture: string;
  };
}
