import { z } from "zod";

import { router, procedure } from "@server/trpc";
import { api_ae_affiliate_products } from "@utils/ae/methods";

export const aeAffiliateRouter = router({
  search: procedure
    .input(
      z.object({
        search: z.string().optional(),
        locale: z.string().optional(),
        page_size: z.number().optional(),
        page_no: z.number().optional(),
      })
    )
    .query(
      async ({ ctx, input }) =>
        await api_ae_affiliate_products({
          method: ctx.aliexpress.affiliate.searchProducts,
          ...input,
          search: input.search ?? "new,hot,best",
        })
    ),
});
