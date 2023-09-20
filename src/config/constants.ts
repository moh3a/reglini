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
