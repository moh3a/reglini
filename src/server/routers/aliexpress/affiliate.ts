import { z } from "zod";
import type { AE_Language } from "ae_sdk";

import { router, procedure } from "~/server/trpc";
import {
  api_ae_affiliate_products,
  api_ae_affiliate_smartmatchproducts,
} from "~/utils/ae/methods";

export const aeAffiliateRouter = router({
  search: procedure
    .input(
      z.object({
        search: z.string().optional(),
        locale: z.string().optional(),
        page_size: z.number().optional(),
        page_no: z.number().optional(),
      }),
    )
    .query(
      async ({ ctx, input }) =>
        await api_ae_affiliate_products({
          method: ctx.aliexpress.affiliate.searchProducts,
          ...input,
          search:
            input.search ??
            ["best", "hot", "new"][Math.floor(Math.random() * 3)],
        }),
    ),
  smartMatch: procedure
    .input(
      z.object({
        product_id: z.string(),
        target_language: z.custom<AE_Language>().optional(),
      }),
    )
    .query(
      async ({ ctx, input }) =>
        await api_ae_affiliate_smartmatchproducts({
          method: ctx.aliexpress.affiliate.smartMatch,
          ...input,
        }),
    ),
});
