import { ACCOUNT_TYPE, AUTH_PROVIDER } from "@prisma/client";
import type { ISession, ProductProperty } from "@reglini-types/index";
import {
  ZAE_ProductVariation,
  ZAE_ProductVariationProperties,
} from "@reglini-types/zapiex";
import { SelectedVariation } from "@reglini-types/index";

export const USER_FROM_TRPC_CTX = (session: ISession | null) => {
  let email = session?.user?.email ? session.user.email : "";
  let account =
    session?.user?.type === "credentials"
      ? ACCOUNT_TYPE.CREDENTIALS
      : ACCOUNT_TYPE.OAUTH;

  let provider: "FACEBOOK" | "GOOGLE" | undefined = undefined;
  if (account === "OAUTH" && session && session.user) {
    if (session.user.provider === "facebook") provider = AUTH_PROVIDER.FACEBOOK;
    else if (session.user.provider === "google")
      provider = AUTH_PROVIDER.GOOGLE;
    else provider = undefined;
  }

  return {
    email,
    account,
    provider,
  };
};

export const GetPrice = (
  currency: number,
  commission: number,
  amount: number
) => {
  if (currency && commission) {
    return (
      Math.ceil((amount * currency + amount * currency * commission) / 10) * 10
    );
  } else {
    return 0;
  }
};

export const calculate_discount = (
  originalPrice: string | number,
  discountedPrice: string | number
): number => {
  return Math.floor(
    ((Number(originalPrice) - Number(discountedPrice)) * 100) /
      Number(originalPrice)
  );
};

export const parse_locale = (locale?: string | null) => {
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

export const validate_product_variation_quantity = (
  product: ZAE_ProductVariation,
  quantity: number
) => {
  if (product.stock && product.stock > 0 && product.stock >= quantity)
    return quantity;
  else return 0;
};

export const check_property = (
  variation_properties: (ProductProperty | undefined)[],
  sku_properties: ZAE_ProductVariationProperties,
  sku_index: number,
  check: boolean[]
) => {
  if (
    variation_properties.find(
      (p) =>
        p?.name === sku_properties.name &&
        p?.value === sku_properties.value.name
    )
  )
    check[sku_index] = true;
  else check[sku_index] = false;
};

export const find_selected_sku = (
  sku: ZAE_ProductVariation,
  variation_properties: (ProductProperty | undefined)[],
  default_image: string,
  quantity: number
) => {
  let check: boolean[] = new Array(sku.properties.length).fill(false);
  sku.properties.forEach((property, index) => {
    check_property(variation_properties, property, index, check);
  });
  if (!check.includes(false)) {
    return {
      success: true,
      selected: {
        ...sku,
        imageUrl: sku.imageUrl ?? default_image,
        quantity: validate_product_variation_quantity(sku, quantity),
      },
    };
  } else return { success: false };
};

export const select_product_variation = (
  product_variations: ZAE_ProductVariation[],
  variation_properties: (ProductProperty | undefined)[],
  quantity: number,
  default_image: string
) => {
  let selected: Partial<SelectedVariation> = {};

  if (product_variations.length === 1) {
    Object.assign(selected, {
      ...product_variations[0],
      imageUrl: product_variations[0].imageUrl ?? default_image,
      quantity: validate_product_variation_quantity(
        product_variations[0],
        quantity
      ),
    });
  } else if (product_variations.length > 1) {
    product_variations.forEach((variation) => {
      const result = find_selected_sku(
        variation,
        variation_properties,
        default_image,
        quantity
      );
      if (result.success) Object.assign(selected, result.selected);
    });
  }

  return selected;
};
