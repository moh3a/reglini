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
        search: z.string(),
        locale: z.string().optional(),
        page_size: z.number().optional(),
        page_no: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const categories = await ctx.aliexpress.affiliate.categories();
      const response = await ctx.aliexpress.affiliate.searchProducts(
        input.search,
        categories,
        input.page_size ?? 20,
        input.page_no ?? 1,
        input.locale ?? "FR"
      );
      // const response = await ctx.aliexpress.affiliate.hotproducts(
      //   categories,
      //   input.search,
      //   input.page_size ?? 20,
      //   input.page_no ?? 1,
      //   input.locale ?? "FR"
      // );
      return response;
    }),
  featuredPromo: procedure
    .input(
      z.object({
        locale: z.string().optional(),
        page_size: z.number().optional(),
        page_no: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.aliexpress.affiliate.featuredPromo(
        input.page_size ?? 20,
        input.page_no ?? 1,
        input.locale ?? "FR"
      );
    }),
  category: procedure
    .input(z.object({ category_id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return input.category_id
        ? await ctx.aliexpress.affiliate.categoryById(input.category_id)
        : undefined;
    }),
});
