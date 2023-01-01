import { z } from "zod";
import { router, procedure } from "../trpc";

export const aliexpressRouter = router({
  product: procedure
    .input(z.object({ id: z.string(), locale: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      // const response = await ctx.aliexpress.ds.shipping(parseInt(input.id), 1);
      // return response;
    }),
});
