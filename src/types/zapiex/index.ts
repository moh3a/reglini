import { Price } from "..";

export interface ZAE_Product {
  productUrl: string;
  productId: string;
  statusId: string;
  status: string;
  currency: string;
  locale: string;
  shipTo: string;
  title: string;
  totalStock: number;
  totalOrders: number;
  wishlistCount?: number;
  unitName?: string;
  unitNamePlural?: string;
  unitsPerProduct?: number;
  hasPurchaseLimit?: boolean;
  maxPurchaseLimit?: number;
  processingTimeInDays: number;
  productImages: string[];
  productCategory?: {
    id: string;
    name: string;
    path: [
      {
        id: string;
        name: string;
        level: number;
      }
    ];
  };
  seller: {
    storeUrl: string;
    storeId: string;
    storeName: string;
    sellerId?: string;
    companyId?: string;
  };
  sellerDetails: {
    sellerDetailsUrl: string;
    summary?: {
      contactPerson: string;
      country: string;
      openingDate: string;
    };
    detailedRatings: {
      itemAsDescribed: ZAE_SellerRatings;
      communication: ZAE_SellerRatings;
      shippingSpeed: ZAE_SellerRatings;
    };
    ratingsHistory?: {
      total: ZAE_ProductRatings;
      lastMonth: ZAE_ProductRatings;
      lastThreeMonths: ZAE_ProductRatings;
      lastSixMonths: ZAE_ProductRatings;
    };
  };
  hasSinglePrice: boolean;
  price?: {
    web: ZAE_ProductPrice;
    app: ZAE_ProductPrice;
  };
  priceSummary?: {
    web: ZAE_ProductPriceSummary;
    app: ZAE_ProductPriceSummary;
  };
  hasAttributes: boolean;
  attributes: ZAE_ProductAttribute[];
  hasReviewsRatings: boolean;
  reviewsRatings: {
    totalCount: number;
    averageRating: number;
    positiveRatings?: {
      count: number;
      percentage: number;
    };
    negativeRatings?: {
      count: number;
      percentage: number;
    };
    neutralRatings?: {
      count: number;
      percentage: number;
    };
    fiveStar?: {
      count: number;
      percentage: number;
    };
    fourStar?: {
      count: number;
      percentage: number;
    };
    threeStar?: {
      count: number;
      percentage: number;
    };
    twoStar?: {
      count: number;
      percentage: number;
    };
    oneStar?: {
      count: number;
      percentage: number;
    };
  };
  hasProperties: boolean;
  properties: ZAE_ProductProperties[];
  hasVariations: boolean;
  variations: ZAE_ProductVariation[];
  shipping?: ZAE_ProductShipping;
  htmlDescription: string;
}

export interface ZAE_ProductShipping {
  isAvailableForSelectedCountries: boolean;
  shipFrom?: string;
  currency?: string;
  carriers?: ZAE_ProductShippingCarrier[];
}

export interface ZAE_ProductVariation {
  sku: string;
  stock?: number;
  imageUrl: string;
  thumbnailImageUrl: string;
  properties: ZAE_ProductVariationProperties[];
  price: {
    web: ZAE_ProductPrice;
    app: ZAE_ProductPrice;
  };
}

export interface ZAE_Price {
  value: number;
  display?: string;
}

export interface ZAE_PriceInterval {
  min: ZAE_Price;
  max: ZAE_Price;
}

export interface ZAE_ProductPrice {
  originalPrice: ZAE_Price;
  hasDiscount: boolean;
  discountPercentage: number;
  discountedPrice: ZAE_Price;
  hasBulkPrice?: boolean;
  bulkMinQuantity?: number;
  bulkDiscountPercentage?: number;
  bulkPrice?: ZAE_Price;
}

export interface ZAE_ProductPriceSummary {
  originalPrice: ZAE_PriceInterval;
  hasDiscount: boolean;
  discountPercentage: number;
  discountedPrice: ZAE_PriceInterval;
  hasBulkPrice?: boolean;
  bulkMinQuantity?: number;
  bulkDiscountPercentage?: number;
  bulkPrice?: ZAE_PriceInterval;
}

export interface ZAE_SellerRatings {
  totalCount?: number;
  rating: {
    value: number;
    percentage?: number;
  };
  otherSellersDifference?: number;
}

export interface ZAE_ProductRatings {
  positive: {
    count: number;
    percentage: number;
  };
  neutral: {
    count: number;
    percentage: number;
  };
  negative: {
    count: number;
    percentage: number;
  };
}

export interface ZAE_ProductAttribute {
  id: string;
  name: string;
  value: {
    id: string;
    name: string;
    imageUrl?: string;
  };
}

export interface ZAE_ProductShippingCarrier {
  company: ZAE_CarrierInfo;
  hasTracking?: boolean;
  price: Omit<ZAE_Price, "display">;
  hasDiscount?: boolean;
  discountPercentage?: number;
  estimatedDeliveryDate?: string;
  deliveryTimeInDays?: Price;
}

export interface ZAE_ProductPropertyDetails {
  id: string;
  name: string;
  hasImage?: boolean;
  imageUrl?: string;
  thumbnailImageUrl?: string;
}

export interface ZAE_ProductProperties {
  id: string;
  name: string;
  values: ZAE_ProductPropertyDetails[];
}

export interface ZAE_ProductVariationProperties {
  id?: string;
  name?: string;
  value: ZAE_ProductPropertyDetails;
}

export interface ZAE_SearchItem {
  productId: string;
  title: string;
  imageUrl: string;
  averageRating: number;
  productMinPrice: Omit<ZAE_Price, "display">;
  shippingMinPrice?: Omit<ZAE_Price, "display">;
  totalOrders?: number;
}

export interface ZAE_Search {
  totalCount: number;
  numberOfPages: number;
  resultsPerPage: number;
  currency: string;
  items: ZAE_SearchItem[];
  availableShipFromCountries?: [string];
  refiningAttributes?: ZAE_ProductAttribute[];
  refiningSearchCategories?: [
    {
      id: string;
      name: string;
      hasChildCategories: boolean;
      childCategories: [
        {
          id: string;
          name: string;
        }
      ];
    }
  ];
}

export interface ZAE_ShippingAddres {
  name: string;
  countryCode: string;
  province: string;
  city: string;
  zipCode: string;
  addressLine1: string;
  addressLine2?: string;
  mobilePhone: string;
  phoneCountry: "+213";
}

export interface ZAE_OrderProductDetails {
  productId: string;
  title: string;
  subStatus: string;
  productImage: string;
  unitName: string;
  quantity: number;
  memo: string;
  price: {
    total: ZAE_Price;
    unit: ZAE_Price;
  };
  hasRefund: boolean;
  carrier: ZAE_CarrierInfo;
  processingTimeInDays: number;
  deliveryTimeInDays: Price;
  shippingPrice: ZAE_Price;
  hasIssue: boolean;
  issueStatus: string;
  sku: string;
  properties: ZAE_ProductAttribute[];
  daysUntilBuyerProtectionStart: number;
  daysUntilBuyerProtectionEnd: number;
  canOpenDispute: boolean;
  canSubmitDispute: boolean;
  canSubmitIssue: boolean;
  canSubmitWarranty: boolean;
}

export interface ZAE_CarrierInfo {
  id: string;
  name: string;
}

export interface ZAE_Order {
  orderDetailsUrl: string;
  orderId: string;
  shipTo: string;
  storeId: string;
  storeName: string;
  sellerId: string;
  companyId: string;
  creationTime: string;
  currency: string;
  totalPrice: {
    productsPrice: ZAE_Price;
    shippingPrice: ZAE_Price;
    fullOrderPrice: ZAE_Price;
  };
  isPaid: boolean;
  paymentTime: string;
  status: string;
  statusDescription: string;
  endReason: string;
  msUntilAutomaticClosingDate: number;
  shippingAddress: ZAE_ShippingAddres;
  products: ZAE_OrderProductDetails[];
  isFrozen: boolean;
  frozenStatus: string;
  canTracking: boolean;
  canConfirmReceived: boolean;
  canResume: boolean;
  canCancel: boolean;
  canEvaluate: boolean;
  canAdditionalEval: boolean;
  canPhotoReview: boolean;
  canPay: boolean;
  canExtend: boolean;
  maxExtendDays: number;
}

export interface ZAE_TrackingCheckpoint {
  location: string;
  date: string;
  caption: string;
  icon: string;
}

export interface ZAE_TrackingPackage {
  caption: string;
  readyForDispatchTime: string;
  deliveryTimeRange: {
    min: string;
    max: string;
  };
  shipTo: string;
  shipFrom: string;
  trackingNumber: string;
  officialWebsite: string;
  trackingUrl: string;
  carrier: ZAE_CarrierInfo;
  progressPercentage: number;
  hasCheckpoints: boolean;
  checkpoints: ZAE_TrackingCheckpoint[];
}

export interface ZAE_Tracking {
  isTrackingAvailable: boolean;
  packages: ZAE_TrackingPackage[];
  shippingAddress: ZAE_ShippingAddres;
}
