export type Result<T, E extends Error = Error> =
  | { success: true; result: T }
  | { success: false; error: E };

export type MessageType = "error" | "warning" | "success";

export interface SetMessageParams {
  type: MessageType;
  text: string;
  duration: number;
}

export type SetMessageType = (
  params: Omit<SetMessageParams, "duration">
) => void;
export type SetTimedMessageType = (params: SetMessageParams) => void;

export interface IMessage {
  type?: MessageType;
  text?: string;
}

export interface MessageStore extends IMessage {
  setTimedMessage: SetTimedMessageType;
  setMessage: SetMessageType;
  resetMessage: () => void;
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

export interface FinanceStore {
  commission?: number;
  euro?: number;
  usd?: number;
  set_commission: (data: number) => void;
  set_currency: (currency: "EUR" | "USD", data: number) => void;
}

export interface InstallPWAStore {
  can_install: boolean;
  set_can_install: (data: boolean) => void;
  prompt: any;
  set_prompt: (event: any) => void;
}

export interface Price {
  min: number;
  max: number;
}

export interface ProductProperty {
  name: string;
  value: string;
}

import { ZAE_ProductVariation } from "./zapiex";
export interface SelectedVariation extends ZAE_ProductVariation {
  quantity?: number;
}

import { DS_ProductAPI_Product_SKU_Variation } from "./ae";
export interface SelectedProductVariation
  extends DS_ProductAPI_Product_SKU_Variation {
  imageUrl: string;
  quantity: number;
}

export interface AEProduct {
  productId: string;
  quantity: number;
  sku: string;
  carrierId: string;
  orderMemo: string | null;
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
  discountedPrice: Price;
  originalPrice: Price;
}

export interface AENOProduct extends AEProduct {
  id: string;
  name: string;
  imageUrl: string;
  properties: string | null; // AEProductProperties[] | ZAE_ProductProperties[] | null;
  price: number;
  originalPrice: number | null;
  shippingPrice: number | null;
  totalPrice: number | null;
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
