export const APP_NAME = "reglini-dz";
export const APP_SLOGAN = "Aliexpress in algerian dinars.";
export const APP_DESCRIPTION =
  "Want to shop from AliExpress but don't have foreign exchange currency? Start buying from Aliexpress right now using DZD.";

export const APP_URL = "https://reglini-dz.com";
export const LOGO_URL =
  "https://res.cloudinary.com/dyypyf2sg/image/upload/v1640361409/reglinidz-icon-oval_ykndfi.png";

export const API_RESPONSE_MESSAGES = {
  NOT_FOUND: (field: string) => `${field} not found.`,
  ERROR_OCCURED: "An error has occured.",
  ERROR_OCCURED_WITH_MESSAGE: (loc: string) => `ERROR: ${loc}`,
  LOGGED_IN: "You must be logged in to do this action.",
  UNAUTHORIZED: "You are not authorized to make this action.",
  AE_AFFILIATE_SEARCH_PRODUCTS_FAIL:
    "Failed to query Aliexpress products, Code: AASPF",
  AE_AFFILIATE_SEARCH_PRODUCTS_ERROR:
    "Failed to query Aliexpress products, Code: AASPE",
  AE_DS_PRODUCT_DETAILS_FAIL: "Failed to get product details, Code: ADPDF",
  AE_DS_PRODUCT_SHIPPING_DETAILS_FAIL:
    "Failed to get Aliexpress product's shipping details, Code: ADPSDF",
  AE_DS_PRODUCT_SHIPPING_SKU_ID_REQUIRED:
    "Aliexpress product's sku ID is needed for the shipping details, Code: APSIDR",
  AE_DS_PRODUCT_SHIPPING_DETAILS_ERROR:
    "Failed to get Aliexpress product's shipping details, Code: ADPSDE",
  AE_DS_PRODUCT_TRACKING_INFO_FAIL:
    "Failed to get Aliexpress product's tracking info, Code: ADPTIF",
  AE_DS_PRODUCT_TRACKING_INFO_ERROR:
    "Failed to get Aliexpress product's tracking info, Code: ADPTIE",
};

export const DEFAULT_PAGE_SIZE = 18;

export const ORDER_CREATION_ERRORS = {
  REMOTE_CREATE_ORDER_RESULT_ERROR: "Order parameters validation failed.",
  B_DROPSHIPPER_DELIVERY_ADDRESS_VALIDATE_FAIL:
    "Buyer's address validation failed.",
  BLACKLIST_BUYER_IN_LIST: "This user is temporarily unable to place an order.",
  USER_ACCOUNT_DISABLED:
    "Buyer account has been disabled. Contact customer service for further information",
  PRICE_PAY_CURRENCY_ERROR:
    "Order products should be declared in the same currency.",
  DELIVERY_METHOD_NOT_EXIST: "Delivery method is not valid.",
  INVENTORY_HOLD_ERROR: "Product inventory is insufficient.",
  REPEATED_ORDER_ERROR:
    "Order creation request was already handled successfully.",
  ERROR_WHEN_BUILD_FOR_PLACE_ORDER: "System error. Please try again later.",
  A001_ORDER_CANNOT_BE_PLACED: "Order cannot be placed.",
  A002_INVALID_ZONE: "Invalid zone.",
  A003_SUSPICIOUS_BUYER: "Suspiscious buyer.",
  A004_CANNOT_USER_COUPON: "Cannot user coupon.",
  A005_INVALID_COUNTRIES: "Invalid country.",
  A006_INVALID_ACCOUNT_INFO: "Invalid account info.",
};
