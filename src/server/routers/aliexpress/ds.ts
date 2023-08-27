import { z } from "zod";

import { router, procedure } from "@server/trpc";
import { API_RESPONSE_MESSAGES } from "@config/general";
import { ae_product } from "@utils/ae/helpers";
import { api_ae_ds_shipping, api_ae_ds_tracking } from "@utils/ae/methods";
import { api_zapiex_product } from "@utils/zapiex/methods";

export const aeDsRouter = router({
  product: procedure
    .input(z.object({ id: z.number(), locale: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      try {
        const response = await ctx.aliexpress.ds.productDetails(
          input.id,
          input.locale ?? "EN"
        );

        if (response && response.result) {
          const product = ae_product(response.result, input.locale);

          if (product.currency !== "USD") {
            return api_zapiex_product({
              method: ctx.zapiex.getProductById,
              id: input.id.toString(),
              locale: input.locale,
            });
          }

          const shippingResponse = await api_ae_ds_shipping({
            method: ctx.aliexpress.ds.shipping,
            product_id: input.id,
            quantity: 1,
          });
          product.shipping = shippingResponse.data;

          return {
            success: true,
            data: product,
          };
        } else {
          return api_zapiex_product({
            method: ctx.zapiex.getProductById,
            id: input.id.toString(),
            locale: input.locale,
          });
        }
      } catch (_) {
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.AE_DS_PRODUCT_DETAILS_FAIL,
        };
      }
    }),
  shipping: procedure
    .input(z.object({ id: z.number(), quantity: z.number().optional() }))
    .mutation(async ({ ctx, input }) =>
      api_ae_ds_shipping({
        method: ctx.aliexpress.ds.shipping,
        product_id: input.id,
        quantity: input.quantity,
      })
    ),
  tracking: procedure
    .input(
      z.object({
        order_id: z.string(),
        tracking_id: z.string(),
        service_name: z.string(),
      })
    )
    .query(async ({ ctx, input }) =>
      api_ae_ds_tracking({
        method: ctx.aliexpress.ds.tracking,
        ...input,
      })
    ),
});
