import { ACCOUNT_TYPE, AUTH_PROVIDER } from "@prisma/client";
import { z } from "zod";

import { router, procedure } from "../trpc";

export const wishlistRouter = router({
  get: procedure.query(async ({ ctx }) => {
    if (ctx.session && ctx.session.user) {
      try {
        const wishlist = await ctx.prisma.wishlist.findMany({
          where: {
            user: {
              email: ctx.session.user.email!,
              account:
                ctx.session.user.type === "credentials"
                  ? ACCOUNT_TYPE.CREDENTIALS
                  : ACCOUNT_TYPE.OAUTH,
              provider:
                ctx.session.user.provider === "facebook"
                  ? AUTH_PROVIDER.FACEBOOK
                  : ctx.session.user.provider === "google"
                  ? AUTH_PROVIDER.GOOGLE
                  : undefined,
            },
          },
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
        id: z.string(),
        imageUrl: z.string(),
        name: z.string(),
        price: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        try {
          await ctx.prisma.wishlist.upsert({
            where: { id: input.id },
            update: input,
            create: {
              ...input,
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
