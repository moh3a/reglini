import { z } from "zod";

import { ZAE_ShippingAddres } from "@config/zapiex";
import { AEProduct } from "@reglini-types/index";
import { router, procedure } from "../trpc";

export const orderRouter = router({
  create: procedure
    .input(
      z.object({
        shippingAddress: z.custom<ZAE_ShippingAddres>(),
        products: z.custom<AEProduct[]>(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        const result = await ctx.zapiex.createOrder(
          input.products,
          input.shippingAddress
        );
        console.log(result);
      } else
        return {
          success: false,
          error: "You must be logged in.",
        };
    }),
});
