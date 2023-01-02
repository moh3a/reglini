import { z } from "zod";
import { router, procedure } from "../trpc";

export const aeDsRouter = router({
  product: procedure
    .input(z.object({ id: z.number(), locale: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      const response = await ctx.aliexpress.ds.productDetails(
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
      const response = await ctx.aliexpress.ds.searchProducts(
        input.search,
        input.locale ?? "FR",
        input.page_size,
        input.page_no
      );
      return response;
    }),
});
