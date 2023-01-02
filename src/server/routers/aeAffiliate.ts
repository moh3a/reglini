import { z } from "zod";
import { router, procedure } from "../trpc";

export const aeAffiliateRouter = router({
  product: procedure
    .input(z.object({ id: z.string(), locale: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const response = await ctx.aliexpress.affiliate.productDetails(
        input.id,
        input.locale ?? "FR"
      );
      return response;
    }),

  search: procedure
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        locale: z.string().optional(),
        page_size: z.number().optional(),
        page_no: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const categories = await ctx.aliexpress.affiliate.categories();
      const response = await ctx.aliexpress.affiliate.hotproducts(
        input.category ?? categories,
        input.search,
        input.page_size,
        input.page_no,
        input.locale ?? "FR"
      );
      return response;
    }),
});
