import { ZAPIEX } from "@config/zapiex";
import { z } from "zod";
import { router, procedure } from "../trpc";

export const aliexpressRouter = router({
  product: procedure
    .input(z.object({ id: z.string(), locale: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      // try {
      //   const response = await ctx.aliexpress.ds.productById(
      //     input.id,
      //     input.locale
      //   );
      //   return response;
      // } catch (err) {
      //   console.log(err);
      // }
      const data = await ZAPIEX.getProductById(input.id, input.locale);
      return data;
    }),
});
