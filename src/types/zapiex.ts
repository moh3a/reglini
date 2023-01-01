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
  wishlistCount: number;
  unitName: string;
  unitNamePlural: string;
  unitsPerProduct: number;
  hasPurchaseLimit: boolean;
  maxPurchaseLimit: number;
  processingTimeInDays: number;
  productImages: string[];
  productCategory: {
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
    summary: {
      contactPerson: string;
      country: string;
      openingDate: string;
    };
    detailedRatings: {
      itemAsDescribed: ZAE_SellerRatings;
      communication: ZAE_SellerRatings;
      shippingSpeed: ZAE_SellerRatings;
    };
    ratingsHistory: {
      total: ZAE_ProductRatings;
      lastMonth: ZAE_ProductRatings;
      lastThreeMonths: ZAE_ProductRatings;
      lastSixMonths: ZAE_ProductRatings;
    };
  };
  hasSinglePrice: boolean;
  price: {
    web: ZAE_ProductPrice;
    app: ZAE_ProductPrice;
  };
  priceSummary: {
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
  hasProperties: true;
  properties: ZAE_ProductProperties[];
  hasVariations: boolean;
  variations: [
    {
      sku: string;
      stock: number;
      imageUrl: string;
      thumbnailImageUrl: string;
      properties: [
        {
          id: string;
          name: string;
          value: {
            id: string;
            name: string;
          };
        }
      ];
      price: {
        web: ZAE_ProductPrice;
        app: ZAE_ProductPrice;
      };
    }
  ];
  shipping: {
    shipFrom: string;
    isAvailableForSelectedCountries: boolean;
    currency: string;
    carriers: ZAE_ProductShippingCarrier[];
  };
  htmlDescription: string;
}

export interface ZAE_ProductPrice {
  originalPrice: { value: number; display: string };
  hasDiscount: boolean;
  discountPercentage: number;
  discountedPrice: { value: number; display: string };
  hasBulkPrice: boolean;
  bulkMinQuantity: number;
  bulkDiscountPercentage: number;
  bulkPrice: { value: number; display: string };
}

export interface ZAE_ProductPriceSummary {
  originalPrice: {
    min: { value: number; display: string };
    max: { value: number; display: string };
  };
  hasDiscount: boolean;
  discountPercentage: number;
  discountedPrice: {
    min: { value: number; display: string };
    max: { value: number; display: string };
  };
  hasBulkPrice: boolean;
  bulkMinQuantity: number;
  bulkDiscountPercentage: number;
  bulkPrice: {
    min: { value: number; display: string };
    max: { value: number; display: string };
  };
}

export interface ZAE_SellerRatings {
  totalCount: number;
  rating: {
    value: number;
    percentage: number;
  };
  otherSellersDifference: number;
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
  company: {
    id: string;
    name: string;
  };
  hasTracking: boolean;
  price: {
    value: number;
  };
  hasDiscount: boolean;
  discountPercentage: number;
  estimatedDeliveryDate: string;
  deliveryTimeInDays: {
    min: number;
    max: number;
  };
}

export interface ZAE_ProductProperties {
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

export interface ZAE_Search {
  totalCount: number;
  numberOfPages: number;
  resultsPerPage: number;
  currency: string;
  items: [
    {
      productId: string;
      title: string;
      imageUrl: string;
      totalOrders: number;
      averageRating: number;
      shippingMinPrice: {
        value: number;
      };
      productMinPrice: {
        value: number;
      };
    }
  ];
  availableShipFromCountries: [string];
  refiningAttributes: ZAE_ProductAttribute[];
  refiningSearchCategories: [
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
    productsPrice: {
      value: number;
      display: string;
    };
    shippingPrice: {
      value: number;
      display: string;
    };
    fullOrderPrice: {
      value: number;
      display: string;
    };
  };
  isPaid: boolean;
  paymentTime: string;
  status: string;
  statusDescription: string;
  endReason: string;
  msUntilAutomaticClosingDate: number;
  shippingAddress: ZAE_ShippingAddres;
  products: [
    {
      productId: string;
      title: string;
      subStatus: string;
      productImage: string;
      unitName: string;
      quantity: number;
      memo: string;
      price: {
        total: {
          value: number;
          display: string;
        };
        unit: {
          value: number;
          display: string;
        };
      };
      hasRefund: boolean;
      carrier: {
        id: string;
        name: string;
      };
      processingTimeInDays: number;
      deliveryTimeInDays: {
        min: number;
        max: number;
      };
      shippingPrice: {
        value: number;
        display: string;
      };
      hasIssue: boolean;
      issueStatus: string;
      sku: string;
      properties: [
        {
          id: string;
          name: string;
          value: {
            id: string;
            name: string;
          };
        }
      ];
      daysUntilBuyerProtectionStart: number;
      daysUntilBuyerProtectionEnd: number;
      canOpenDispute: boolean;
      canSubmitDispute: boolean;
      canSubmitIssue: boolean;
      canSubmitWarranty: boolean;
    }
  ];
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

export interface ZAE_Tracking {
  isTrackingAvailable: boolean;
  packages: [
    {
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
      carrier: {
        id: string;
        name: string;
      };
      progressPercentage: number;
      hasCheckpoints: boolean;
      checkpoints: [
        {
          location: string;
          date: string;
          caption: string;
          icon: string;
        }
      ];
    }
  ];
  shippingAddress: ZAE_ShippingAddres;
}
