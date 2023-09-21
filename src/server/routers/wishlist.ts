import { USER_FROM_TRPC_CTX } from "@utils/index";
import { z } from "zod";

import { router, protectedProcedure } from "../trpc";
import { API_RESPONSE_MESSAGES } from "@config/general";

export const wishlistRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    try {
      const wishlist = await ctx.prisma.wishlist.findMany({
        where: { user: USER_FROM_TRPC_CTX(ctx.session) },
      });
      return {
        success: true,
        wishlist,
      };
    } catch (_) {
      return {
        success: false,
        error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
      };
    }
  }),
  add: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        imageUrl: z.string(),
        name: z.string(),
        price: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.wishlist.upsert({
          where: { id: input.productId },
          update: input,
          create: {
            productId: input.productId,
            imageUrl: input.imageUrl,
            name: input.name,
            price: input.price,
            user: { connect: { email: ctx.session.user.email! } },
          },
        });
        return {
          success: true,
          message: "Item successfully added to your wishlist.",
        };
      } catch (_) {
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
        };
      }
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.wishlist.delete({
          where: { id: input.id },
        });
        return {
          success: true,
          message: "Item successfully deleted from your wishlist.",
        };
      } catch (_) {
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
        };
      }
    }),
});
