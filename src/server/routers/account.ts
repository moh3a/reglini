import { ACCOUNT_TYPE, AUTH_PROVIDER } from "@prisma/client";
import { z } from "zod";

import { router, procedure } from "../trpc";

export const accountRouter = router({
  profile: procedure.query(async ({ ctx, input }) => {
    if (ctx.session && ctx.session.user) {
      try {
        const user = await ctx.prisma.user.findFirst({
          where: {
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
          include: {
            address: true,
            profile: true,
          },
        });
        return {
          success: true,
          user,
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
  wishlist: procedure.query(async ({ ctx, input }) => {
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
  addToWishlist: procedure
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
            error: null,
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
  verification: procedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        try {
          const user = await ctx.prisma.user.findFirst({
            where: {
              email: ctx.session.user.email!,
              account: ACCOUNT_TYPE.CREDENTIALS,
              verifyCredentialsToken: input.token,
            },
          });
          if (user) {
            return {
              success: true,
              message: "Account successfully verified!",
            };
          } else
            return {
              success: false,
              message: "Error with session or token.",
            };
        } catch (error) {
          return {
            success: false,
            message: JSON.stringify(error),
          };
        }
      } else
        return {
          success: false,
          message: "You must be logged in.",
        };
    }),
  delete: procedure.mutation(async ({ ctx }) => {
    if (ctx.session && ctx.session.user) {
      try {
        await ctx.prisma.user.delete({
          where: {
            email: ctx.session.user.email!,
          },
        });
        return {
          success: true,
        };
      } catch (error) {
        return {
          success: false,
        };
      }
    } else
      return {
        success: false,
      };
  }),
});
