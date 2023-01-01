export type AE_API_NAMES = DS_API_NAMES | AFFILIATE_API_NAMES;

export type DS_API_NAMES =
  | "aliexpress.ds.recommend.feed.get"
  | "aliexpress.ds.product.get"
  | "aliexpress.trade.buy.placeorder"
  | "aliexpress.ds.trade.order.get"
  | "aliexpress.logistics.buyer.freight.calculate"
  | "aliexpress.logistics.ds.trackinginfo.query";

export type AFFILIATE_API_NAMES = "hello.world";

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

/**
 * Product details
 * @param {String} ship_to_country Country
 * @param {Number} product_id Item ID
 * @param {String} target_currency Target currency
 * @param {String} target_language Target language
 */
export interface DS_ProductAPI_Product_Detail_Params {
  ship_to_country?: string;
  product_id: number;
  target_currency?: string;
  target_language?: string;
}

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

export interface DS_OrderAPI_Get_Order_Params {
  order_id: number;
}

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
