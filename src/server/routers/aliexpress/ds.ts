import { z } from "zod";
import type { AE_Language } from "ae_sdk";

import { router, procedure } from "~/server/trpc";
import {
  API_RESPONSE_MESSAGES,
  DEFAULT_COUNTRY_SHIPPED_TO,
  DEFAULT_PRICE_CURRENCY,
} from "~/config/constants";
import { ae_product } from "~/utils/ae/convert_to_rae";
import { api_ae_ds_shipping, api_ae_ds_tracking } from "~/utils/ae/methods";

export const aeDsRouter = router({
  product: procedure
    .input(
      z.object({ id: z.number(), locale: z.custom<AE_Language>().optional() }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const response = await ctx.aliexpress.ds.product(
          input.id,
          DEFAULT_COUNTRY_SHIPPED_TO,
          DEFAULT_PRICE_CURRENCY,
          input.locale ?? "EN",
        );

        if (response.ok && response.data) {
          const product = ae_product(
            response.data.aliexpress_ds_product_get_response.result,
            input.locale,
          );

          return {
            success: true,
            data: product,
          };
        } else {
          return {
            success: false,
            error: API_RESPONSE_MESSAGES.AE_DS_PRODUCT_DETAILS_FAIL,
          };
        }
      } catch (err) {
        console.error(err);
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.AE_DS_PRODUCT_DETAILS_FAIL,
        };
      }
    }),
  shipping: procedure
    .input(
      z.object({
        id: z.number(),
        quantity: z.number().optional(),
        sku: z.string().optional(),
      }),
    )
    .query(
      async ({ ctx, input }) =>
        await api_ae_ds_shipping({
          method: ctx.aliexpress.ds.shipping,
          product_id: input.id,
          quantity: input.quantity,
          sku: input.sku,
        }),
    ),
  tracking: procedure
    .input(
      z.object({
        order_id: z.string(),
        tracking_id: z.string(),
        service_name: z.string(),
      }),
    )
    .query(
      async ({ ctx, input }) =>
        await api_ae_ds_tracking({
          method: ctx.aliexpress.ds.tracking,
          ...input,
        }),
    ),
});
