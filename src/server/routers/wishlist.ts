import { USER_FROM_TRPC_CTX } from "@utils/index";
import { z } from "zod";

import { router, procedure } from "../trpc";

export const wishlistRouter = router({
  get: procedure.query(async ({ ctx }) => {
    if (ctx.session && ctx.session.user) {
      try {
        const wishlist = await ctx.prisma.wishlist.findMany({
          where: { user: USER_FROM_TRPC_CTX(ctx.session) },
        });
        return {
          success: true,
          wishlist,
        };
      } catch (error) {
        return {
          success: false,
          error: JSON.stringify(error),
        };
      }
    } else
      return {
        success: false,
        error: "You must be logged in.",
      };
  }),
  add: procedure
    .input(
      z.object({
        productId: z.string(),
        imageUrl: z.string(),
        name: z.string(),
        price: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
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
        } catch (error) {
          return {
            success: false,
            error: JSON.stringify(error),
          };
        }
      } else
        return {
          success: false,
          error: "You must be logged in.",
        };
    }),
  delete: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        try {
          await ctx.prisma.wishlist.delete({
            where: { id: input.id },
          });
          return {
            success: true,
            message: "Item successfully deleted from your wishlist.",
          };
        } catch (error) {
          return {
            success: false,
            error: JSON.stringify(error),
          };
        }
      } else
        return {
          success: false,
          error: "You must be logged in.",
        };
    }),
});
