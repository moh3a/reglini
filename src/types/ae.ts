export type AE_API_NAMES = DS_API_NAMES | AFFILIATE_API_NAMES;

export type DS_API_NAMES =
  | "aliexpress.ds.recommend.feed.get"
  | "aliexpress.ds.product.get"
  | "aliexpress.postproduct.redefining.findaeproductbyidfordropshipper"
  | "aliexpress.trade.buy.placeorder"
  | "aliexpress.ds.trade.order.get"
  | "aliexpress.logistics.buyer.freight.calculate"
  | "aliexpress.logistics.ds.trackinginfo.query"
  | "aliexpress.miniapp.order.cancel";

export type AFFILIATE_API_NAMES =
  | "aliexpress.affiliate.productdetail.get"
  | "aliexpress.affiliate.hotproduct.query";

/**
 * Public parameters
 * @description Public parameters need to be set for every Aliexpress API
 * @param {String} method Indicates the API name.
 * @param {String | undefined} app_key Indicates the AppKey allocated by the TOP to an application. An ISV can choose Open Platform Console > Application Management > Overview to check the AppKey and AppSecret of the formal environment.
 * @param {String} session Indicates the authorization granted by the TOP to an application after a user logs in and grants authorization successfully.
 * @param {String} timestamp Indicates the time stamp in the format of yyyy-MM-dd HH:mm:ss and in the time zone of GMT+8. For example, 2016-01-01 12:00:00. The Taobao API server allows a maximum time error of 10 minutes for a request from a client.
 * @param {String} format Indicates the response format. The default value is xml. The value can be set to xml or json.
 * @param {String} v Indicates the API protocol version. The value can be set to 2.0.
 * @param {Boolean} simplify Indicates whether the simplified JSON return format is used. This parameter is valid only if format is set to json. The default value is false.
 * @param {String} sign_method Indicates the signature digest algorithm. The value can be set to hmac or md5.
 * @param {String} sign Indicates the obtained signature of API input parameters.
 */
export interface PublicParams {
  method: AE_API_NAMES;
  app_key: string;
  session?: string;
  timestamp: string;
  format?: "xml" | "json";
  v: string;
  simplify?: boolean;
  sign_method: "hmac" | "md5";
  sign?: string;
}

export interface AE_Error_Response {
  msg: string;
  code: number;
  sub_msg: string;
  sub_code: string;
}

/**
 *
 * PRODUCT API
 * RECOMMENDED PRODUCTS
 *
 */

/**
 * Parameters to get the recommended products information feed
 * @param {String} feed_name
 * @param {String} category_id Category ID, you can get category ID via "get category" API https://developers.aliexpress.com/en/doc.htm?docId=45801&docType=2
 * @param {Number} page_no Page number
 * @param {String} sort sort by：priceAsc，priceDesc，volumeAsc、volumeDesc, discountAsc, discountDesc, DSRratingAsc，DSRratingDesc,
 * @param {Number} page_size record count of each page, 1 - 50
 * @param {String} target_language target language:EN,RU,PT,ES,FR,ID,IT,TH,JA,AR,VI,TR,DE,HE,KO,NL,PL,MX,CL,IN
 * @param {String} target_currency target currency:USD, GBP, CAD, EUR, UAH, MXN, TRY, RUB, BRL, AUD, INR, JPY, IDR, SEK,KRW
 * @param {String} country screens the subject product library for the target country
 */
export interface DS_ProductAPI_Recommended_Products_Params {
  country?: string;
  target_currency?: "USD" | "EUR";
  target_language?: "EN" | "FR" | "AR";
  page_size?: number;
  sort?:
    | "priceAsc"
    | "priceDesc"
    | "volumeAsc"
    | "volumeDesc"
    | "discountAsc"
    | "discountDesc"
    | "DSRratingAsc"
    | "DSRratingDesc";
  page_no?: number;
  category_id?: string;
  feed_name: string;
}

export interface DS_ProductAPI_Recommended_Products_Result {
  result: {
    total_record_count: number;
    current_record_count: number;
    is_finished: boolean;
    total_page_no: number;
    current_page_no: number;
    products: {
      integer: [
        {
          lastest_volume: number;
          seller_id: number;
          target_sale_price: string;
          evaluate_rate: string;
          target_original_price: string;
          shop_id: number;
          second_level_category_name: string;
          first_level_category_id: number;
          product_video_url: string;
          product_id: number;
          sale_price: string;
          target_sale_price_currency: string;
          second_level_category_id: number;
          shop_url: string;
          product_detail_url: string;
          product_title: string;
          first_level_category_name: string;
          product_main_image_url: string;
          platform_product_type: string;
          target_original_price_currency: string;
          ship_to_days: string;
          sale_price_currency: string;
          original_price: string;
          original_price_currency: string;
          discount: string;
        }
      ];
    };
  };
  rsp_msg: string;
  rsp_code: string;
}

/**
 *
 * PRODUCT API
 * PRODUCT DETAILS
 *
 */

/**
 * Product details
 * @param {String} ship_to_country Country
 * @param {Number} product_id Item ID
 * @param {String} target_currency Target currency
 * @param {String} target_language Target language
 */
export interface DS_ProductAPI_Product_Detail_Params {
  product_id: number;
  local_country?: string;
  local_language?: string;
}

export interface DS_ProductAPI_Product_Detail_Result {
  result: {
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
}

/**
 *
 * ORDER API
 * NEW ORDER
 *
 */

export interface DS_OrderAPI_Place_Order_Params {
  param_place_order_request4_open_api_d_t_o: {
    /**
     * @description Logistics address information
     * @param {String} address Address information
     * @param {String} city
     * @param {String} contact_person 	Contact
     * @param {String} country
     * @param {String} full_name Receiver's full name
     * @param {String} mobile_no telephone number
     * @param {String} phone_country Country code where the phone is located
     * @param {String} province
     * @param {String} zip 	Postal code
     */
    logistics_address: {
      address: string;
      city?: string;
      contact_person?: string;
      country?: string;
      full_name?: string;
      mobile_no?: string;
      phone_country?: string;
      province?: string;
      zip?: string;
    };
    /**
     * @description Product attribute
     * @param {Number} product_count Number of Products
     * @param {Number} product_id Product id
     * @param {String} sku_attr Product sku
     * @param {String} logistics_service_name 	Logistics service name
     * @param {String} order_memo User Comments
     */
    product_items: {
      product_count: number;
      product_id: number;
      sku_attr?: string;
      logistics_service_name?: string;
      order_memo?: string;
    };
  };
}

export interface DS_OrderAPI_Place_Order_Result {
  result: {
    error_code: string;
    error_msg: string;
    order_list: {
      number: number[];
    };
    is_success: boolean;
  };
}

/**
 *
 * ORDER API
 * GET ORDER
 *
 */

export interface DS_OrderAPI_Get_Order_Params {
  order_id: number;
}

export interface DS_OrderAPI_Get_Order_Result {
  result: {
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
  rsp_msg: string;
  rsp_code: string;
}

/**
 *
 * ORDER API
 * CANCEL ORDER
 *
 */

export interface DS_OrderAPI_Cancel_Order_Params {
  trade_order_id: number;
}

export interface DS_OrderAPI_Cancel_Order_Result {
  trade_order_id: number;
}

/**
 *
 * SHIPPING API
 * SHIPPING INFO
 *
 */

export interface DS_ShippingAPI_Shipping_Info_Params {
  /**
   * Get the support logistics info of a product, provide for dropshipping develeopers.
   *
   * @param {String} product_id Product ID
   * @param {String} city_code City code
   * @param {String} country_code National code
   * @param {String} product_num Number of Products
   * @param {String} province_code Province code
   * @param {String} send_goods_country_code Shipping country code
   * @param {String} price price
   * @param {String} price_currency Commodity price currency
   *
   * Apply JSON.stringify to pass params
   */
  param_aeop_freight_calculate_for_buyer_d_t_o: string;
}

export interface DS_ShippingAPI_Shipping_Info_Result {
  aeop_freight_calculate_result_for_buyer_d_t_o_list: {
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
  };
  error_desc: string;
  success: boolean;
}

/**
 *
 * SHIPPING API
 * TRACKING INFO
 *
 */

/**
 * Dropshipper query logistics tracking information
 *
 * @param {String} logistics_no Logistics tracking number
 * @param {String} origin Order origin to be queried. The origin of the AE order is “ESCROW”.
 * @param {String} out_ref 	Order ID to be queried by the user
 * @param {String} service_name Logistics service KEY
 * @param {String} to_area Countries for receiving goods, DZ
 */
export interface DS_ShippingAPI_Tracking_Info_Params {
  logistics_no: string;
  origin: string;
  out_ref: string;
  service_name: string;
  to_area: string;
}

export interface DS_ShippingAPI_Tracking_Info_Result {
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
  error_desc: string;
  result_success: boolean;
}

/**
 * AFFILIATE API
 * PRODUCT DETAILS
 */
export interface Affiliate_Product_Details_Params {
  app_signature?: string;
  fields?: string;
  product_ids: string;
  target_currency?: string;
  target_language?: string;
  tracking_id?: string;
  country?: string;
}

export interface Affiliate_Product_Details_Result {
  resp_result: {
    resp_code: number;
    resp_msg: string;
    result: {
      current_record_count: number;
      products: {
        product: [
          {
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
        ];
      };
    };
  };
}

/**
 * AFFILIATE API
 * HOTPRODUCTS
 */

export interface Affiliate_Hotproducts_Params {
  app_signature?: string;
  category_ids?: string;
  /**
   * @param {String} fields Respond parameter list, eg: commission_rate,sale_price,app_sale_price,shop_id
   */
  fields?: string;
  /**
   * @param {String} keywords Filter products by keywords
   */
  keywords?: string;
  max_sale_price?: string;
  min_sale_price?: string;
  page_no?: string;
  page_size?: string;
  platform_product_type?: string;
  sort?: string;
  target_currency?: string;
  target_language?: string;
  tracking_id?: string;
  delivery_days?: string;
  ship_to_country?: string;
}

export interface Affiliate_Hotproducts_Result {
  resp_code: number;
  resp_msg: string;
  result: {
    current_page_no: number;
    current_record_count: number;
    products: {
      product: [
        {
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
      ];
    };
    total_page_no: number;
    total_record_count: number;
  };
}
