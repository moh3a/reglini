import axios from "axios";
import { config } from "dotenv";
config();

const parseLocale = (locale?: string | null) => {
  if (locale) {
    if (locale.toLowerCase() === "en") {
      locale = "en_US";
    }
    if (locale.toLowerCase() === "fr") {
      locale = "fr_FR";
    }
    if (locale.toLowerCase() === "ar") {
      locale = "ar_MA";
    }
  } else locale = "en_US";
  return locale;
};

export const ZAE_getProductById = async (
  id: string,
  locale?: string | null
) => {
  const { data } = await axios({
    method: "post",
    url: "https://api.zapiex.com/v3/product/details",
    data: {
      productId: id,
      currency: "EUR",
      shipTo: "DZ",
      locale: parseLocale(locale),
      shipFrom: "CN",
      getHtmlDescription: true,
      getShipping: true,
      getSellerDetails: true,
    },
    headers: {
      "x-api-key": process.env.ZAPIEX_KEY,
    },
  });
  return data.data as ZAE_Product;
};

export const ZAE_SearchProduct = async (
  text: string,
  locale?: string | null,
  page?: number | null
) => {
  const { data } = await axios({
    method: "post",
    url: "https://api.zapiex.com/v3/search",
    data: {
      text,
      locale: parseLocale(locale),
      page,
      moreThanFourStarsOnly: true,
      sort: "BEST_MATCH",
      currency: "EUR",
      shipFrom: "CN",
      shipTo: "DZ",
    },
    headers: {
      "x-api-key": process.env.ZAPIEX_KEY,
    },
  });
  return data.data as ZAE_Search;
};

export const ZAE_CreateOrder = async (
  products: {
    productId: string;
    sku: string;
    quantity: number;
    carrierId: string;
    orderMemo: string;
  }[],
  shippingAddress: ZAE_ShippingAddres
) => {
  const { data } = await axios({
    method: "post",
    url: "https://api.zapiex.com/v3/order/create",
    headers: {
      "x-api-key": process.env.ZAPIEX_KEY,
      "Content-Type": "application/json",
    },
    data: {
      username: process.env.ALIEXPRESS_USERNAME,
      password: process.env.ALIEXPRESS_PASSWORD,
      currency: "EUR",
      products,
      shippingAddress,
    },
  });
  return data.data as { orderIds: string[] };
};

export const ZAE_GetOrder = async (id: string) => {
  const { data } = await axios({
    method: "post",
    url: "https://api.zapiex.com/v3/order/details",
    headers: {
      "x-api-key": process.env.ZAPIEX_KEY,
      "Content-Type": "application/json",
    },
    data: {
      username: process.env.ALIEXPRESS_USERNAME,
      password: process.env.ALIEXPRESS_PASSWORD,
      orderId: id,
    },
  });
  return data.data as ZAE_Order;
};

export const ZAE_CancelOrder = async (id: string) => {
  const { data } = await axios({
    method: "post",
    url: "https://api.zapiex.com/v3/order/cancel",
    headers: {
      "x-api-key": process.env.ZAPIEX_KEY,
      "Content-Type": "application/json",
    },
    data: {
      username: process.env.ALIEXPRESS_USERNAME,
      password: process.env.ALIEXPRESS_PASSWORD,
      orderId: id,
    },
  });
  return data.data as { success: boolean };
};

export const ZAE_TrackingOrder = async (id: string) => {
  const { data } = await axios({
    method: "post",
    url: "https://api.zapiex.com/v3/order/tracking",
    headers: {
      "x-api-key": process.env.ZAPIEX_KEY,
      "Content-Type": "application/json",
    },
    data: {
      username: process.env.ALIEXPRESS_USERNAME,
      password: process.env.ALIEXPRESS_PASSWORD,
      orderId: id,
    },
  });
  return data.data as ZAE_Tracking;
};

export const ZAPIEX = {
  getProductById: ZAE_getProductById,
  searchProducts: ZAE_SearchProduct,
  createOrder: ZAE_CreateOrder,
  cancelOrder: ZAE_CancelOrder,
  getOrder: ZAE_GetOrder,
  trackingOrder: ZAE_TrackingOrder,
};

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
  productImages: [string];
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
      itemAsDescribed: {
        totalCount: number;
        rating: {
          value: number;
          percentage: number;
        };
        otherSellersDifference: number;
      };
      communication: {
        totalCount: number;
        rating: {
          value: number;
          percentage: number;
        };
        otherSellersDifference: number;
      };
      shippingSpeed: {
        totalCount: number;
        rating: {
          value: number;
          percentage: number;
        };
        otherSellersDifference: number;
      };
    };
    ratingsHistory: {
      total: {
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
      };
      lastMonth: {
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
      };
      lastThreeMonths: {
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
      };
      lastSixMonths: {
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
      };
    };
  };
  hasSinglePrice: boolean;
  price: {
    web: {
      originalPrice: { value: number; display: string };
      hasDiscount: boolean;
      discountPercentage: number;
      discountedPrice: { value: number; display: string };
      hasBulkPrice: boolean;
      bulkMinQuantity: number;
      bulkDiscountPercentage: number;
      bulkPrice: { value: number; display: string };
    };
    app: {
      originalPrice: { value: number; display: string };
      hasDiscount: boolean;
      discountPercentage: number;
      discountedPrice: { value: number; display: string };
      hasBulkPrice: boolean;
      bulkMinQuantity: number;
      bulkDiscountPercentage: number;
      bulkPrice: { value: number; display: string };
    };
  };
  priceSummary: {
    web: {
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
    };
    app: {
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
    };
  };
  hasAttributes: boolean;
  attributes: [
    {
      id: string;
      name: string;
      value: {
        id: string;
        name: string;
      };
    }
  ];
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
  properties: [
    {
      id: string;
      name: string;
      values: [
        {
          id: string;
          name: string;
          hasImage: boolean;
          imageUrl?: string;
          thumbnailImageUrl?: string;
        }
      ];
    }
  ];
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
        web: {
          originalPrice: { value: number; display: string };
          hasDiscount: boolean;
          discountPercentage: number;
          discountedPrice: { value: number; display: string };
          hasBulkPrice: boolean;
          bulkMinQuantity: number;
          bulkDiscountPercentage: number;
          bulkPrice: { value: number; display: string };
        };
        app: {
          originalPrice: { value: number; display: string };
          hasDiscount: boolean;
          discountPercentage: number;
          discountedPrice: { value: number; display: string };
          hasBulkPrice: boolean;
          bulkMinQuantity: number;
          bulkDiscountPercentage: number;
          bulkPrice: { value: number; display: string };
        };
      };
    }
  ];
  shipping: {
    shipFrom: string;
    isAvailableForSelectedCountries: boolean;
    currency: string;
    carriers: [
      {
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
    ];
  };
  htmlDescription: string;
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
  refiningAttributes: [
    {
      id: string;
      name: string;
      values: [
        {
          id: string;
          name: string;
          imageUrl: string;
        }
      ];
    }
  ];
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
  addressLine2: string;
  mobilePhone: string;
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
