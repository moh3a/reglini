import { z } from "zod";
import { router, procedure } from "../trpc";

export const aliexpressRouter = router({
  product: procedure
    .input(z.object({ id: z.number(), locale: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      const response = await ctx.aliexpress.ds.productDetails(
        input.id,
        input.locale ?? "FR"
      );
      return response;
    }),
});
