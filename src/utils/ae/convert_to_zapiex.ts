// mainly for converting the provided ALIEXPRESS (DS / AFFILIATE) API data
// to one that is compatible with ZAPIEX to use both apis interchangeably

import type {
  Affiliate_Base_Products_Cursor,
  DS_Product,
  DS_Product_Attributes,
  DS_Product_SKU_Properties,
  DS_Product_SKU_Variation,
  DS_Shipping_Details,
} from "~/types/ae";
import type {
  ZAE_PriceInterval,
  ZAE_Product,
  ZAE_ProductAttribute,
  ZAE_ProductPrice,
  ZAE_ProductPriceSummary,
  ZAE_ProductProperties,
  ZAE_ProductShipping,
  ZAE_ProductShippingCarrier,
  ZAE_ProductVariation,
  ZAE_ProductVariationProperties,
  ZAE_Search,
  ZAE_SearchItem,
} from "~/types/zapiex";
import { calculate_discount, parse_locale } from "~/utils/index";

export const parse_ae_product_attributes = (
  initial_array: DS_Product_Attributes[]
): ZAE_ProductAttribute[] => {
  return initial_array.map((value) => ({
    id: value.attr_name_id?.toString(),
    name: value.attr_name,
    value: {
      id: value.attr_value_id?.toString(),
      name: value.attr_value,
    },
  }));
};

export const parse_ae_product_properties = (
  init: DS_Product_SKU_Properties,
  parsed_array: ZAE_ProductProperties[]
) => {
  const property = {
    id: (init.property_value_id_long ?? init.property_value_id)?.toString(),
    name: init.property_value_definition_name
      ? init.property_value_definition_name
      : init.sku_property_value,
    hasImage: init.sku_image ? true : false,
    imageUrl: init.sku_image,
    thumbnailImageUrl: init.sku_image,
  };

  const index = parsed_array.findIndex(
    (e) => e.id === init.sku_property_id?.toString()
  );

  if (index !== -1) {
    const property_exits = parsed_array[index]?.values.find(
      (e) =>
        e.id ===
        (init.property_value_id_long ?? init.property_value_id)?.toString()
    );
    if (!property_exits) parsed_array[index]?.values.push(property);
  } else {
    parsed_array.push({
      id: init.sku_property_id?.toString(),
      name: init.sku_property_name,
      values: [property],
    });
  }
};

export const parse_ae_product_variation_properties = (
  init: DS_Product_SKU_Properties,
  parsed_array: ZAE_ProductVariationProperties[]
) => {
  const property = {
    id: (init.property_value_id_long ?? init.property_value_id)?.toString(),
    name: init.property_value_definition_name
      ? init.property_value_definition_name
      : init.sku_property_value,
    hasImage: init.sku_image ? true : false,
    imageUrl: init.sku_image,
    thumbnailImageUrl: init.sku_image,
  };

  const index = parsed_array.findIndex(
    (e) => e.id === init.sku_property_id?.toString()
  );

  if (index !== -1 && parsed_array[index]) {
    (parsed_array[index] as any).value = property;
  } else {
    parsed_array.push({
      id: init.sku_property_id?.toString(),
      name: init.sku_property_name,
      value: property,
    });
  }
};

export const parse_ae_property_price = (
  sku: DS_Product_SKU_Variation,
  originalPrice: ZAE_PriceInterval,
  discountedPrice: ZAE_PriceInterval
) => {
  if (originalPrice.max.value < parseFloat(sku.sku_price)) {
    originalPrice.max.value = parseFloat(sku.sku_price);
  }
  if (originalPrice.min.value > parseFloat(sku.sku_price)) {
    originalPrice.min.value = parseFloat(sku.sku_price);
  }
  if (discountedPrice.max.value < parseFloat(sku.offer_sale_price)) {
    discountedPrice.max.value = parseFloat(sku.offer_sale_price);
  }
  if (discountedPrice.min.value > parseFloat(sku.offer_sale_price)) {
    discountedPrice.min.value = parseFloat(sku.offer_sale_price);
  }
};

export const get_product_discount = (
  variation?: DS_Product_SKU_Variation
): number => {
  if ( variation &&
    parseFloat(variation.sku_price) > parseFloat(variation.offer_sale_price)
  ) {
    return calculate_discount(variation.sku_price, variation.offer_sale_price);
  } else return 0;
};

export const get_product_price_summary = (
  price: ZAE_ProductPriceSummary,
  variations: DS_Product_SKU_Variation[]
): ZAE_ProductPriceSummary => {
  let discountedPrice: ZAE_ProductPriceSummary["discountedPrice"] = {
    min: { value: 1000000000 },
    max: { value: 0 },
  };
  let originalPrice: ZAE_ProductPriceSummary["originalPrice"] = {
    min: { value: 1000000000 },
    max: { value: 0 },
  };

  variations.forEach((sku) => {
    parse_ae_property_price(sku, originalPrice, discountedPrice);
  });

  const discount = get_product_discount(variations[0]);

  if (discount > 0) {
    price.hasDiscount = true;
    price.discountPercentage = discount;

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

export const get_product_variation_price = (
  price: ZAE_ProductPrice,
  variation: DS_Product_SKU_Variation
): ZAE_ProductPrice => {
  const discount = get_product_discount(variation);
  // get original price
  price.originalPrice.value = parseFloat(variation.sku_price);

  // get discounted price
  if (discount > 0) {
    price.hasDiscount = true;
    price.discountPercentage = discount;
    price.discountedPrice.value = parseFloat(variation.offer_sale_price);
  } else {
    price.hasDiscount = false;
  }

  // get bulk price
  price.hasBulkPrice = variation.sku_bulk_order > 0 ? true : false;
  if (price.hasBulkPrice) {
    price.bulkMinQuantity = variation.sku_bulk_order;
    price.bulkPrice = { value: parseFloat(variation.offer_bulk_sale_price) };
    price.bulkDiscountPercentage = calculate_discount(
      variation.sku_price,
      variation.offer_bulk_sale_price
    );
  }

  return price;
};

export const parse_ae_product_data = (
  data: DS_Product,
  variations: ZAE_ProductVariation[],
  properties: ZAE_ProductProperties[],
  totalStock: number
) => {
  const singlePrice: boolean[] = [];
  // VARIATIONS
  data.ae_item_sku_info_dtos.forEach((variation) => {
    const imageUrl =
      variation.aeop_s_k_u_propertys?.find((sku) => sku.sku_image)?.sku_image ??
      "";
    let variation_properties: ZAE_ProductVariationProperties[] = [];
    if (variation.aeop_s_k_u_propertys) {
      variation.aeop_s_k_u_propertys.forEach((props) => {
        // PROPERTIES
        parse_ae_product_properties(props, properties);
        // CURRENT ITERATION OF VARIATIONS
        parse_ae_product_variation_properties(props, variation_properties);
      });
    }

    if (
      variation.offer_sale_price ===
      data.ae_item_sku_info_dtos[0]?.offer_sale_price
    )
      singlePrice.push(true);
    else singlePrice.push(false);

    let variation_price: ZAE_ProductPrice = {
      hasDiscount: false,
      discountedPrice: { display: "", value: 0 },
      originalPrice: { display: "", value: 0 },
      discountPercentage: 0,
    };
    get_product_variation_price(variation_price, variation);

    totalStock += variation.sku_available_stock ?? 0;

    variations.push({
      imageUrl,
      thumbnailImageUrl: imageUrl,
      sku: variation.id,
      stock: variation.sku_available_stock,
      properties: variation_properties,
      price: {
        web: variation_price,
        app: variation_price,
      },
    });
  });

  // RETURN IF PRODUCT HAS SINGLE PRICE
  return singlePrice.includes(false) ? false : true;
};

export const convert_ae_product = (
  data: DS_Product,
  attributes: ZAE_ProductAttribute[],
  properties: ZAE_ProductProperties[],
  variations: ZAE_ProductVariation[],
  hasSinglePrice: boolean,
  locale: string,
  totalStock: number,
  price?: ZAE_ProductPrice,
  priceSummary?: ZAE_ProductPriceSummary
): ZAE_Product => {
  return {
    productId: data.ae_item_base_info_dto.product_id.toString(),
    productUrl: `https://www.aliexpress.com/item/${data.ae_item_base_info_dto.product_id}.html`,
    title: data.ae_item_base_info_dto.subject,
    locale: parse_locale(locale),
    status: data.ae_item_base_info_dto.product_status_type,
    statusId: data.ae_item_base_info_dto.product_status_type,
    htmlDescription: data.ae_item_base_info_dto.detail,
    currency: data.ae_item_base_info_dto.currency_code.toUpperCase(),
    processingTimeInDays: data.logistics_info_dto.delivery_time,
    totalOrders: 0,
    productImages: data.ae_multimedia_info_dto.image_urls.split(";"),
    totalStock,
    reviewsRatings: {
      averageRating: Number(data.ae_item_base_info_dto.avg_evaluation_rating),
      totalCount: Number(data.ae_item_base_info_dto.evaluation_count),
    },
    seller: {
      storeId: data.ae_store_info.store_id.toString(),
      storeName: data.ae_store_info.store_name,
      storeUrl: `https://www.aliexpress.com/store/${data.ae_store_info.store_id}`,
    },
    sellerDetails: {
      sellerDetailsUrl: `https://www.aliexpress.com/store/feedback-score/${data.ae_store_info.store_id}.html`,
      detailedRatings: {
        communication: {
          rating: {
            value: Number(data.ae_store_info.communication_rating),
          },
        },
        itemAsDescribed: {
          rating: {
            value: Number(data.ae_store_info.item_as_described_rating),
          },
        },
        shippingSpeed: {
          rating: {
            value: Number(data.ae_store_info.shipping_speed_rating),
          },
        },
      },
    },
    shipTo: "DZ",
    attributes,
    properties,
    variations,
    hasAttributes: attributes.length > 0 ? true : false,
    hasProperties: properties.length > 0 ? true : false,
    hasVariations: variations.length > 0 ? true : false,
    hasReviewsRatings:
      Number(data.ae_item_base_info_dto.evaluation_count) > 0 ? true : false,
    hasSinglePrice,
    price: hasSinglePrice && price ? { app: price, web: price } : undefined,
    priceSummary:
      !hasSinglePrice && priceSummary
        ? {
            app: priceSummary,
            web: priceSummary,
          }
        : undefined,
  };
};

export const ae_product = (data: DS_Product, locale: string | undefined) => {
  let attributes: ZAE_ProductAttribute[] = [];
  const variations: ZAE_ProductVariation[] = [];
  const properties: ZAE_ProductProperties[] = [];
  let price: ZAE_ProductPrice | undefined = {
    hasDiscount: false,
    discountPercentage: 0,
    discountedPrice: { value: 0 },
    originalPrice: { value: 0 },
  };
  let priceSummary: ZAE_ProductPriceSummary | undefined = {
    hasDiscount: false,
    discountPercentage: 0,
    discountedPrice: { min: { value: 0 }, max: { value: 0 } },
    originalPrice: { min: { value: 0 }, max: { value: 0 } },
  };
  let hasSinglePrice = true;
  let totalStock = 0;

  if (data.ae_item_sku_info_dtos) {
    hasSinglePrice = parse_ae_product_data(
      data,
      variations,
      properties,
      totalStock
    );
  }

  price =
    data.ae_item_sku_info_dtos && data.ae_item_sku_info_dtos.length > 0 && hasSinglePrice
      ? get_product_variation_price(price, data.ae_item_sku_info_dtos[0]!)
      : undefined;
  priceSummary =
    data.ae_item_sku_info_dtos && !hasSinglePrice
      ? get_product_price_summary(priceSummary, data.ae_item_sku_info_dtos)
      : undefined;

  if (data.ae_item_sku_info_dtos) {
    attributes = parse_ae_product_attributes(data.ae_item_properties);
  }

  return convert_ae_product(
    data,
    attributes,
    properties,
    variations,
    hasSinglePrice,
    locale ?? "FR",
    0,
    price,
    priceSummary
  );
};

export const ae_shipping = (
  carriers: DS_Shipping_Details[]
): ZAE_ProductShipping => {
  if (carriers.length > 0) {
    return convert_ae_shipping_info(carriers);
  } else {
    return {
      isAvailableForSelectedCountries: false,
    };
  }
};

export const convert_ae_shipping_info = (
  shipment_carriers: DS_Shipping_Details[]
): ZAE_ProductShipping => {
  const carriers: ZAE_ProductShippingCarrier[] = shipment_carriers.map(
    (carrier) => ({
      price: { value: carrier.freight.amount },
      company: { id: carrier.service_name, name: carrier.service_name },
      hasDiscount: false,
      estimatedDeliveryDate: carrier.estimated_delivery_time,
      hasTracking: carrier.tracking_available === "true" ? true : false,
    })
  );
  return {
    isAvailableForSelectedCountries: true,
    shipFrom: "CN",
    currency:
      shipment_carriers[0]?.freight?.currency_code?.toUpperCase() ?? "USD",
    carriers,
  };
};

export const ae_affiliate_products = (
  res: Affiliate_Base_Products_Cursor
): ZAE_Search => {
  const items: ZAE_SearchItem[] | undefined = res.products?.map((product) => {
    return {
      productId: product.product_id?.toString() ?? "",
      title: product.product_title ?? "",
      imageUrl: product.product_main_image_url ?? "",
      averageRating: Number(product.evaluate_rate) ?? 0,
      productMinPrice: { value: Number(product.target_sale_price) },
    };
  });
  return {
    totalCount: res.total_record_count ?? 0,
    numberOfPages: res.total_page_no ?? 0,
    resultsPerPage: res.current_record_count ?? 0,
    currency: res.products && res.products[0] ? res.products[0].target_sale_price_currency : "USD",
    items: items ?? [],
  };
};
