import { USER_FROM_TRPC_CTX } from "@utils/index";
import { z } from "zod";

import { router, procedure } from "../trpc";
import { API_RESPONSE_MESSAGES } from "@config/general";

export const cartRouter = router({
  get: procedure.query(async ({ ctx }) => {
    if (ctx.session && ctx.session.user) {
      try {
        const cart = await ctx.prisma.cart.findMany({
          where: { user: USER_FROM_TRPC_CTX(ctx.session) },
        });
        return {
          success: true,
          cart,
        };
      } catch (_) {
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
        };
      }
    } else
      return {
        success: false,
        error: API_RESPONSE_MESSAGES.LOGGED_IN,
      };
  }),
  add: procedure
    .input(
      z.object({
        productId: z.string(),
        imageUrl: z.string(),
        name: z.string(),
        price: z.number(),
        carrierId: z.string(),
        originalPrice: z.number().optional(),
        quantity: z.number(),
        shippingPrice: z.number().optional(),
        sku: z.string(),
        totalPrice: z.number().optional(),
        properties: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        try {
          const items = await ctx.prisma.cart.findMany({
            where: {
              user: { email: ctx.session.user.email! },
              productId: input.productId,
            },
          });
          let found = false;
          for (const item of items) {
            if (item && item.sku === input.sku) {
              found = true;
              break;
            }
          }
          if (found) {
            return { success: false, error: "Item is already in cart." };
          } else {
            const updated = await ctx.prisma.cart.create({
              data: {
                ...input,
                user: { connect: { email: ctx.session.user.email! } },
              },
            });
            if (updated)
              return {
                success: true,
                message: "Item successfully added to your cart.",
              };
            else
              return {
                success: false,
                error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
              };
          }
        } catch (_) {
          return {
            success: false,
            error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
          };
        }
      } else
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.LOGGED_IN,
        };
    }),
  updateQuantity: procedure
    .input(z.object({ id: z.string(), quantity: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        try {
          await ctx.prisma.cart.update({
            where: { id: input.id },
            data: { quantity: input.quantity },
          });
          return {
            success: true,
            message: "Item quantity successfully updated.",
          };
        } catch (_) {
          return {
            success: false,
            error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
          };
        }
      } else
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.LOGGED_IN,
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
          await ctx.prisma.cart.delete({
            where: { id: input.id },
          });
          return {
            success: true,
            message: "Item successfully deleted from your cart.",
          };
        } catch (_) {
          return {
            success: false,
            error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
          };
        }
      } else
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.LOGGED_IN,
        };
    }),
  empty: procedure.mutation(async ({ ctx }) => {
    if (ctx.session && ctx.session.user) {
      try {
        await ctx.prisma.cart.deleteMany({
          where: { user: { email: ctx.session.user.email! } },
        });
        return {
          success: true,
          message: "Items successfully deleted from your cart.",
        };
      } catch (_) {
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
        };
      }
    } else
      return {
        success: false,
        error: API_RESPONSE_MESSAGES.LOGGED_IN,
      };
  }),
});
