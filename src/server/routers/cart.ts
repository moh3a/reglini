import { USER_FROM_TRPC_CTX } from "~/utils/index";
import { z } from "zod";

import { router, protectedProcedure } from "~/server/trpc";
import { API_RESPONSE_MESSAGES } from "~/config/constants";

export const cartRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    try {
      const cart = await ctx.db.cart.findMany({
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
  }),
  add: protectedProcedure
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const items = await ctx.db.cart.findMany({
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
          const updated = await ctx.db.cart.create({
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
    }),
  updateQuantity: protectedProcedure
    .input(z.object({ id: z.string(), quantity: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.cart.update({
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
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.cart.delete({
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
    }),
  empty: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      await ctx.db.cart.deleteMany({
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
  }),
});
