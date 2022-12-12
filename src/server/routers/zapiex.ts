import { z } from "zod";
import { router, procedure } from "../trpc";

export const zapiexRouter = router({
  product: procedure
    .input(z.object({ id: z.string(), locale: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.zapiex.getProductById(input.id, input.locale);
        return { success: true, data };
      } catch (error) {
        return { success: false, error: JSON.stringify(error) };
      }
    }),
  search: procedure
    .input(
      z.object({
        text: z.string().nullish(),
        locale: z.string().nullish(),
        page: z.number().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.zapiex.searchProducts(
          input.text && input.text.length > 0 ? input.text : "new",
          input.locale,
          input.page
        );
        return { success: true, data };
      } catch (error) {
        return { success: false, error: JSON.stringify(error) };
      }
    }),
});
