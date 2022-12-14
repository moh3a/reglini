import { z } from "zod";

import { AEProduct } from "@reglini-types/index";
import { ZAE_ShippingAddres } from "@reglini-types/zapiex";
import { router, procedure } from "../trpc";
import SendEmail from "@utils/send_email";

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
  pay: procedure
    .input(
      z.object({
        order_id: z.string(),
        method: z.enum(["CCP", "CIB"]),
        receipt_url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        const data = {
          date: new Date(),
          hasTimedOut: false,
          isPaymentConfirmed: false,
          paymentMethod: input.method,
          receipt: input.receipt_url,
          wasDeclined: false,
        };
        const payment = await ctx.prisma.payment.upsert({
          where: { orderId: input.order_id },
          update: data,
          create: { ...data, orderId: input.order_id },
        });
        SendEmail({
          from: "support@reglini-dz.com",
          to: "moh3a@reglini-dz.com",
          subject: `Check the payment made by ${ctx.session.user.email}`,
          text: `
          <h2>
          User with email address ${ctx.session.user.email} has made a payment.
          </h2>
          <p>The payment was made for order with the order id ${input.order_id}.</p>
          <p>The payment was via ${input.method}.</p>
          <p>Here's the image sent to validate the payment.</p>
          <img alt='payment' src=${input.receipt_url} />
          <p>A response should be sent to the user.</p>
          `,
        });
        if (payment) {
          return { success: true, message: "Payment is successful." };
        } else return { success: false, error: "An error has occured." };
      } else
        return {
          success: false,
          error: "You must be logged in.",
        };
    }),
  cancel: procedure
    .input(z.object({ order_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        const result = await ctx.zapiex.cancelOrder(input.order_id);
        console.log(result);
        if (result.success) {
          await ctx.prisma.shipping.delete({
            where: { orderId: input.order_id },
          });
          await ctx.prisma.packageReceipt.delete({
            where: { orderId: input.order_id },
          });
          await ctx.prisma.order.update({
            where: { id: input.order_id },
            data: {
              cancelled: true,
            },
          });

          return {
            success: true,
            message: "Successfully cancelled this order.",
          };
        } else return { success: false, error: "An error has occured." };
      } else
        return {
          success: false,
          error: "You must be logged in.",
        };
    }),
});
