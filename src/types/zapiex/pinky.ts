import { ZAE_Product, ZAE_Search } from "~/types/zapiex";

export interface API_ZAPIEX_PRODUCT_ARGUMENTS {
  id: string;
  locale?: string | null | undefined;
}

export interface API_ZAPIEX_PRODUCT_PARAMS
  extends API_ZAPIEX_PRODUCT_ARGUMENTS {
  method: (args: API_ZAPIEX_PRODUCT_ARGUMENTS) => Promise<ZAE_Product>;
}

export interface API_ZAPIEX_PRODUCT_SEARCH_ARGUMENTS {
  text: string;
  locale?: string | null | undefined;
  page?: number | null | undefined;
}

export interface API_ZAPIEX_PRODUCT_SEARCH_PARAMS
  extends API_ZAPIEX_PRODUCT_SEARCH_ARGUMENTS {
  method: (args: API_ZAPIEX_PRODUCT_SEARCH_ARGUMENTS) => Promise<ZAE_Search>;
}
