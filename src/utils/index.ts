import { ACCOUNT_TYPE, AUTH_PROVIDER } from "@prisma/client";
import { AEProductPrice, ISession, Price } from "../types";
import {
  DS_ProductAPI_Product_SKU_Properties,
  DS_ProductAPI_Product_SKU_Variation,
} from "@reglini-types/ae";
import { ZAE_ProductProperties } from "@reglini-types/zapiex";

export const USER_FROM_TRPC_CTX = (session: ISession | null) => {
  let email =
    session && session.user && session.user.email ? session.user.email : "";
  let account =
    session && session.user && session.user.type === "credentials"
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

export const parse_ae_properties = (
  init: DS_ProductAPI_Product_SKU_Properties,
  parsed_array: ZAE_ProductProperties[]
) => {
  const property = {
    id: init.property_value_id_long.toString(),
    name: init.property_value_definition_name
      ? init.property_value_definition_name
      : init.sku_property_value,
    hasImage: init.sku_image ? true : false,
    imageUrl: init.sku_image,
    thumbnailImageUrl: init.sku_image,
  };

  const index = parsed_array.findIndex(
    (e) => e.id === init.sku_property_id.toString()
  );

  if (index !== -1) {
    const property_exits = parsed_array[index].values.find(
      (e) => e.id === init.property_value_id_long.toString()
    );
    if (!property_exits) parsed_array[index].values.push(property);
  } else {
    parsed_array.push({
      id: init.sku_property_id.toString(),
      name: init.sku_property_name,
      values: [property],
    });
  }
};

export const parse_ae_property_price = (
  sku: DS_ProductAPI_Product_SKU_Variation,
  originalPrice: Price,
  discountedPrice: Price
) => {
  if (originalPrice.max < parseFloat(sku.sku_price)) {
    originalPrice.max = parseFloat(sku.sku_price);
  }
  if (originalPrice.min > parseFloat(sku.sku_price)) {
    originalPrice.min = parseFloat(sku.sku_price);
  }
  if (discountedPrice.max < parseFloat(sku.offer_sale_price)) {
    discountedPrice.max = parseFloat(sku.offer_sale_price);
  }
  if (discountedPrice.min > parseFloat(sku.offer_sale_price)) {
    discountedPrice.min = parseFloat(sku.offer_sale_price);
  }
};

export const get_product_discount = (
  variation: DS_ProductAPI_Product_SKU_Variation
): number => {
  let discount = 0;

  if (
    parseFloat(variation.sku_price) > parseFloat(variation.offer_sale_price)
  ) {
    discount = Math.floor(
      ((parseFloat(variation.sku_price) -
        parseFloat(variation.offer_sale_price)) *
        100) /
        parseFloat(variation.sku_price)
    );
  } else discount = 0;

  return discount;
};

export const get_product_price = (
  price: AEProductPrice,
  variations: DS_ProductAPI_Product_SKU_Variation[]
): AEProductPrice => {
  let discountedPrice = {
    min: 1000000000,
    max: 0,
  };
  let originalPrice = {
    min: 1000000000,
    max: 0,
  };

  variations.forEach((sku) => {
    parse_ae_property_price(sku, originalPrice, discountedPrice);
  });

  const discount = get_product_discount(variations[0]);

  if (discount > 0) {
    price.hasDiscount = true;
    price.discount = discount;

    price.discountedPrice = {
      min: discountedPrice.min,
      max: discountedPrice.max,
    };
    price.originalPrice = {
      min: originalPrice.min,
      max: originalPrice.max,
    };
  } else {
    price.hasDiscount = false;
    price.originalPrice = {
      min: originalPrice.min,
      max: originalPrice.max,
    };
  }

  return price;
};
