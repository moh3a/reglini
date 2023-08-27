import { z } from "zod";

import { router, procedure } from "@server/trpc";
import { api_ae_affiliate_products } from "@utils/ae/methods";
import { api_zapiex_product_search } from "@utils/zapiex/methods";

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
    .query(async ({ ctx, input }) => {
      const args = {
        categories_method: ctx.aliexpress.affiliate.categories,
        method: ctx.aliexpress.affiliate.searchProducts, // ctx.aliexpress.affiliate.hotproducts
        ...input,
        search: input.search ?? "original",
      };
      if (input.search) {
        const response = await api_zapiex_product_search({
          method: ctx.zapiex.searchProducts,
          text: input.search,
          locale: input.locale,
          page: input.page_no,
        });
        if (response.success) return response;
        else return api_ae_affiliate_products(args);
      } else return api_ae_affiliate_products(args);
    }),
});
