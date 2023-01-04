import { z } from "zod";

import { router, procedure } from "../trpc";
import { ZAE_ProductProperties } from "@reglini-types/zapiex";
import { AEProductPrice } from "@reglini-types/index";

export const aeDsRouter = router({
  product: procedure
    .input(z.object({ id: z.number(), locale: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      let properties: ZAE_ProductProperties[] = [];
      let price: AEProductPrice = {
        hasDiscount: false,
        discount: 0,
        discountedPrice: { min: 0, max: 0 },
        originalPrice: { min: 0, max: 0 },
      };
      const response = await ctx.aliexpress.ds.productDetails(
        input.id,
        input.locale ?? "FR"
      );

      // PROPERTIES
      if (response.result.aeop_ae_product_s_k_us) {
        response.result.aeop_ae_product_s_k_us.map((variations) => {
          if (variations.aeop_s_k_u_propertys) {
            variations.aeop_s_k_u_propertys?.map((props) => {
              const index = properties.findIndex(
                (e) => e.id === props.sku_property_id.toString()
              );
              if (index !== -1) {
                const exits = properties[index].values.find(
                  (e) => e.id === props.property_value_id_long.toString()
                );
                if (!exits)
                  properties[index].values.push({
                    id: props.property_value_id_long.toString(),
                    name: props.property_value_definition_name
                      ? props.property_value_definition_name
                      : props.sku_property_value,
                    hasImage: props.sku_image ? true : false,
                    imageUrl: props.sku_image,
                    thumbnailImageUrl: props.sku_image,
                  });
              } else {
                properties.push({
                  id: props.sku_property_id.toString(),
                  name: props.sku_property_name,
                  values: [
                    {
                      id: props.property_value_id_long.toString(),
                      name: props.property_value_definition_name
                        ? props.property_value_definition_name
                        : props.sku_property_value,
                      hasImage: props.sku_image ? true : false,
                      imageUrl: props.sku_image,
                      thumbnailImageUrl: props.sku_image,
                    },
                  ],
                });
              }
            });
          }
        });
      }

      // PRICE
      let max = 0;
      response.result.aeop_ae_product_s_k_us.forEach((sku) => {
        if (max < parseFloat(sku.sku_price)) {
          max = parseFloat(sku.sku_price);
        }
      });

      if (
        parseFloat(response.result.aeop_ae_product_s_k_us[0].sku_price) >
        parseFloat(response.result.aeop_ae_product_s_k_us[0].offer_sale_price)
      ) {
        let discount = Math.ceil(
          ((parseFloat(response.result.aeop_ae_product_s_k_us[0].sku_price) -
            parseFloat(
              response.result.aeop_ae_product_s_k_us[0].offer_sale_price
            )) *
            100) /
            parseFloat(response.result.aeop_ae_product_s_k_us[0].sku_price)
        );

        price.hasDiscount = true;
        price.discount = discount;

        price.discountedPrice = {
          min: parseFloat(response.result.item_offer_site_sale_price),
          max: Math.ceil((max - max * (discount / 100)) * 100) / 100,
        };
        price.originalPrice = {
          min: parseFloat(response.result.item_offer_site_sale_price),
          max,
        };
      } else {
        price.hasDiscount = false;
        price.originalPrice = {
          min: parseFloat(response.result.item_offer_site_sale_price),
          max,
        };
      }

      return { result: response.result, properties, price };
    }),
  search: procedure
    .input(
      z.object({
        search: z.string(),
        locale: z.string().optional(),
        page_size: z.number().optional(),
        page_no: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const response = await ctx.aliexpress.ds.searchProducts(
        input.search,
        input.locale ?? "FR",
        input.page_size,
        input.page_no
      );
      return response;
    }),
  shipping: procedure
    .input(z.object({ id: z.number(), quantity: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const response = await ctx.aliexpress.ds.shipping(
        input.id,
        input.quantity ?? 1
      );
      return response;
    }),
});
