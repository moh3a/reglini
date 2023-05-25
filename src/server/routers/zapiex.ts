import { z } from "zod";
import { router, procedure } from "../trpc";
import { API_RESPONSE_MESSAGES } from "@config/general";

export const zapiexRouter = router({
  product: procedure
    .input(z.object({ id: z.string(), locale: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.zapiex.getProductById(input.id, input.locale);
        return { success: true, data };
      } catch (_) {
        return { success: false, error: API_RESPONSE_MESSAGES.ERROR_OCCURED };
      }
    }),
  search: procedure
    .input(
      z.object({
        text: z.string().optional(),
        locale: z.string().optional(),
        page: z.number().optional(),
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
      } catch (_) {
        return { success: false, error: API_RESPONSE_MESSAGES.ERROR_OCCURED };
      }
    }),
});
