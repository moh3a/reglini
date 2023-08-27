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
  AE_DS_PRODUCT_SHIPPING_DETAILS_ERROR:
    "Failed to get Aliexpress product's shipping details, Code: ADPSDE",
  AE_DS_PRODUCT_TRACKING_INFO_FAIL:
    "Failed to get Aliexpress product's tracking info, Code: ADPTIF",
  AE_DS_PRODUCT_TRACKING_INFO_ERROR:
    "Failed to get Aliexpress product's tracking info, Code: ADPTIE",
  ZAPIEX_SEARCH_PRODUCTS_FAIL:
    "Failed to query Aliexpress products, Code: ZSPF",
  ZAPIEX_SEARCH_PRODUCTS_ERROR:
    "Failed to query Aliexpress products, Code: ZSPE",
  ZAPIEX_PRODUCT_DETAILS_FAIL: "Failed to get product details, Code: ZPDF",
  ZAPIEX_PRODUCT_DETAILS_ERROR: "Failed to get product details, Code: ZPDE",
};
