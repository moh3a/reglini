import { z } from "zod";

import { AEProduct } from "@reglini-types/index";
import { ZAE_ShippingAddres } from "@reglini-types/zapiex";
import { router, procedure } from "../trpc";

export const orderRouter = router({
  all: procedure.query(async ({ ctx }) => {
    if (ctx.session && ctx.session.user) {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        include: {
          orders: {
            include: {
              payment: true,
              product: true,
              received: true,
              shippingAddress: true,
            },
          },
        },
      });
      if (user) {
        return { success: true, orders: user.orders };
      } else return { success: false, error: "No user was found." };
    } else
      return {
        success: false,
        error: "You must be logged in.",
      };
  }),
  get: procedure
    .input(
      z.object({
        order_id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        const user = await ctx.prisma.user.findFirst({
          where: {
            email: ctx.session.user.email!,
            orders: {
              some: {
                id: input.order_id,
              },
            },
          },
        });
        if (user) {
          const result = await ctx.aliexpress.ds.getOrder(
            parseInt(input.order_id)
          );
          if (result.result) {
            return { success: true, result: result.result };
          } else return { success: false, error: "An error has occured." };
        } else return { success: false, error: "No user with this order ID." };
      } else
        return {
          success: false,
          error: "You must be logged in.",
        };
    }),
  details: procedure
    .input(
      z.object({
        order_id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        const order = await ctx.prisma.order.findUnique({
          where: { id: input.order_id },
          include: {
            payment: true,
            product: true,
            received: true,
            shippingAddress: true,
          },
        });
        return { success: true, order };
      } else
        return {
          success: false,
          error: "You must be logged in.",
        };
    }),
  create: procedure
    .input(
      z.object({
        shippingAddress: z.custom<ZAE_ShippingAddres>(),
        products: z.custom<AEProduct[]>(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        const user = await ctx.prisma.user.findUnique({
          where: { email: ctx.session.user.email! },
        });
        if (user) {
          try {
            const product_items = input.products.map((product) => {
              return {
                logistics_service_name: product.carrierId,
                order_memo: product.orderMemo,
                product_count: product.quantity,
                product_id: parseInt(product.productId),
                sku_attr: product.sku,
              };
            });
            const result = await ctx.aliexpress.ds.createOrder(
              {
                address: input.shippingAddress.addressLine1,
                city: input.shippingAddress.city,
                contact_person: input.shippingAddress.name,
                country: input.shippingAddress.countryCode,
                full_name: input.shippingAddress.name,
                mobile_no: input.shippingAddress.mobilePhone,
                phone_country: input.shippingAddress.phoneCountry,
                province: input.shippingAddress.province,
                zip: input.shippingAddress.zipCode,
              },
              product_items
            );
            if (result.result) {
              if (result.result.is_success) {
                for (const order_id of result.result.order_list) {
                  await ctx.prisma.order.create({
                    data: {
                      id: order_id.toString(),
                      userId: user.id,
                      shippingAddress: {
                        create: input.shippingAddress,
                      },
                    },
                  });
                }
                return {
                  success: true,
                  message: "Successfully created your orders.",
                };
              } else return { success: false, error: result.result.error_msg };
            } else
              return {
                success: false,
                error: (result as any).error_response.msg,
              };
          } catch (error) {
            return { success: false, error: JSON.stringify(error) };
          }
        } else return { success: false, error: "No user was found." };
      } else
        return {
          success: false,
          error: "You must be logged in.",
        };
    }),
});
