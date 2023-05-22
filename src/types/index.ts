export interface IMessage {
  type?: "success" | "error" | "warning";
  text?: string;
}

export interface ISession {
  expires: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    type?: "oauth" | "credentials" | null;
    provider?: "google" | "facebook" | null;
    access_token?: string | null;
  };
}

export interface EmailOptions {
  from?: string;
  to?: string;
  subject: string;
  text: string;
}

export interface MDBUser {
  _id: string;
  name?: string;
  realName?: string;
  email: string;
  role: "basic" | "admin";
  account: "oauth" | "credentials";
  provider?: "facebook" | "google";
  verified?: boolean;
  verifyCredentialsToken?: string;
  password?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  picture?: any;
  phoneNumber?: string;
  address?: {
    text?: string;
    postalCode?: string;
    wilaya?: string;
    daira?: string;
    commune?: string;
    streetName?: string;
  };
  cart?: {
    cartItems: [
      {
        productId: string;
        name: string;
        sku?: string;
        price: number;
        originalPrice?: number;
        imageUrl: string;
        properties?: [{}];
        quantity: number;
        carrierId: string;
        shippingPrice?: number;
        totalPrice?: number;
      }
    ];
    subtotal: number;
    count: number;
  };
  wishlist?: [
    {
      productId: string;
      name: string;
      imageUrl: string;
      price: number;
    }
  ];
  orders?: [
    {
      orderId: string;
      product?: {
        productId?: string;
        name?: string;
        sku?: string;
        price: number;
        shippingPrice?: number;
        totalPrice?: number;
        imageUrl?: string;
        properties: [{}];
        quantity: number;
        carrierId: string;
        orderMemo: string;
      };
      shippingAddress: {
        name?: string;
        countryCode?: string;
        city?: string;
        zipCode?: string;
        addressLine1?: string;
        phoneCountry?: string;
        mobilePhone?: string;
        province?: string;
      };
      details: {
        gmt_create?: string;
        order_status?: string;
        logistics_status?: string;
        order_amount?: {
          amount?: string;
          currency_code?: string;
        };
        child_order_list?: {
          aeop_child_order_info?: [
            {
              product_id?: number;
              product_price: {
                amount?: string;
                currency_code?: string;
              };
              product_name?: string;
              product_count?: number;
            }
          ];
        };
        logistics_info_list?: {
          ae_order_logistics_info?: [
            {
              logistics_no?: string;
              logistics_service?: string;
            }
          ];
        };
        store_info?: {
          store_id?: number;
          store_name?: string;
          store_url?: string;
        };
      };
      tracking?: {
        hasTracking?: boolean;
        details?: [
          {
            event_desc?: string;
            signed_name?: string;
            status?: string;
            address?: string;
            event_date?: string;
          }
        ];
        official_website?: string;
      };
      currency: string;
      payment?: {
        hasTimedOut?: boolean;
        isPaymentConfirmed?: boolean;
        wasDeclined?: boolean;
        receipt?: string;
        paymentMethod?: "cib" | "ccp";
        paymentTime?: string;
      };
      packageReceived?: {
        wasReceived: boolean;
        packagePicture?: string;
      };
    }
  ];
}

export interface AEProduct {
  productId: string;
  quantity: number;
  sku: string;
  carrierId: string;
  orderMemo?: string;
}

export interface AEProductProperties {
  sku_property_id?: number;
  sku_image?: string;
  property_value_id_long?: number;
  property_value_definition_name?: string;
  sku_property_value?: string;
  sku_property_name?: string;
}

export interface AEProductPrice {
  hasDiscount: boolean;
  discount: number;
  discountedPrice: {
    min: number;
    max: number;
  };
  originalPrice: {
    min: number;
    max: number;
  };
}

export interface AENOProduct extends AEProduct {
  id: string;
  name: string;
  imageUrl: string;
  properties: any; // AEProductProperties[] | ZAE_ProductProperties[] | null;
  price: number;
  originalPrice?: number;
  shippingPrice?: number;
  totalPrice?: number;
}

export interface AENOProductItem {
  logistics_service_name?: string;
  order_memo?: string;
  product_count: number;
  product_id: number;
  sku_attr?: string;
}

export interface AENOLogisticsAddress {
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
