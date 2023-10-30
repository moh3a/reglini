import type { Price } from "..";

export interface RAE_Product {
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
      },
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
      itemAsDescribed: RAE_SellerRatings;
      communication: RAE_SellerRatings;
      shippingSpeed: RAE_SellerRatings;
    };
    ratingsHistory?: {
      total: RAE_ProductRatings;
      lastMonth: RAE_ProductRatings;
      lastThreeMonths: RAE_ProductRatings;
      lastSixMonths: RAE_ProductRatings;
    };
  };
  hasSinglePrice: boolean;
  price?: {
    web: RAE_ProductPrice;
    app: RAE_ProductPrice;
  };
  priceSummary?: {
    web: RAE_ProductPriceSummary;
    app: RAE_ProductPriceSummary;
  };
  hasAttributes: boolean;
  attributes: RAE_ProductAttribute[];
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
  properties: RAE_ProductProperties[];
  hasVariations: boolean;
  variations: RAE_ProductVariation[];
  shipping?: RAE_ProductShipping;
  htmlDescription: string;
}

export interface RAE_ProductShipping {
  isAvailableForSelectedCountries: boolean;
  shipFrom?: string;
  currency?: string;
  carriers?: RAE_ProductShippingCarrier[];
}

export interface RAE_ProductVariation {
  sku: string;
  stock?: number;
  imageUrl: string;
  thumbnailImageUrl: string;
  properties: RAE_ProductVariationProperties[];
  price: {
    web: RAE_ProductPrice;
    app: RAE_ProductPrice;
  };
}

export interface RAE_Price {
  value: number;
  display?: string;
}

export interface RAE_PriceInterval {
  min: RAE_Price;
  max: RAE_Price;
}

export interface RAE_ProductPrice {
  originalPrice: RAE_Price;
  hasDiscount: boolean;
  discountPercentage: number;
  discountedPrice: RAE_Price;
  hasBulkPrice?: boolean;
  bulkMinQuantity?: number;
  bulkDiscountPercentage?: number;
  bulkPrice?: RAE_Price;
}

export interface RAE_ProductPriceSummary {
  originalPrice: RAE_PriceInterval;
  hasDiscount: boolean;
  discountPercentage: number;
  discountedPrice: RAE_PriceInterval;
  hasBulkPrice?: boolean;
  bulkMinQuantity?: number;
  bulkDiscountPercentage?: number;
  bulkPrice?: RAE_PriceInterval;
}

export interface RAE_SellerRatings {
  totalCount?: number;
  rating: {
    value: number;
    percentage?: number;
  };
  otherSellersDifference?: number;
}

export interface RAE_ProductRatings {
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

export interface RAE_ProductAttribute {
  id: string;
  name: string;
  value: {
    id: string;
    name: string;
    imageUrl?: string;
  };
}

export interface RAE_ProductShippingCarrier {
  company: RAE_CarrierInfo;
  hasTracking?: boolean;
  price: Omit<RAE_Price, "display">;
  hasDiscount?: boolean;
  discountPercentage?: number;
  estimatedDeliveryDate?: string;
  deliveryTimeInDays?: Partial<Price>;
}

export interface RAE_ProductPropertyDetails {
  id: string;
  name: string;
  hasImage?: boolean;
  imageUrl?: string;
  thumbnailImageUrl?: string;
}

export interface RAE_ProductProperties {
  id: string;
  name: string;
  values: RAE_ProductPropertyDetails[];
}

export interface RAE_ProductVariationProperties {
  id?: string;
  name?: string;
  value: RAE_ProductPropertyDetails;
}

export interface RAE_SearchItem {
  productId: string;
  title: string;
  imageUrl: string;
  averageRating: number;
  productMinPrice: Omit<RAE_Price, "display">;
  shippingMinPrice?: Omit<RAE_Price, "display">;
  totalOrders?: number;
}

export interface RAE_Search {
  totalCount: number;
  numberOfPages: number;
  resultsPerPage: number;
  currency: string;
  items: RAE_SearchItem[];
  availableShipFromCountries?: [string];
  refiningAttributes?: RAE_ProductAttribute[];
  refiningSearchCategories?: [
    {
      id: string;
      name: string;
      hasChildCategories: boolean;
      childCategories: [
        {
          id: string;
          name: string;
        },
      ];
    },
  ];
}

export interface RAE_ShippingAddres {
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

export interface RAE_OrderProductDetails {
  productId: string;
  title: string;
  subStatus: string;
  productImage: string;
  unitName: string;
  quantity: number;
  memo: string;
  price: {
    total: RAE_Price;
    unit: RAE_Price;
  };
  hasRefund: boolean;
  carrier: RAE_CarrierInfo;
  processingTimeInDays: number;
  deliveryTimeInDays: Price;
  shippingPrice: RAE_Price;
  hasIssue: boolean;
  issueStatus: string;
  sku: string;
  properties: RAE_ProductAttribute[];
  daysUntilBuyerProtectionStart: number;
  daysUntilBuyerProtectionEnd: number;
  canOpenDispute: boolean;
  canSubmitDispute: boolean;
  canSubmitIssue: boolean;
  canSubmitWarranty: boolean;
}

export interface RAE_CarrierInfo {
  id: string;
  name: string;
}
