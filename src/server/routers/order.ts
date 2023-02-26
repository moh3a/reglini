import { z } from "zod";

import { AENOProduct, AEProduct } from "@reglini-types/index";
import { ZAE_ShippingAddres } from "@reglini-types/zapiex";
import { router, procedure } from "../trpc";
import SendEmail from "@utils/send_email";

export const orderRouter = router({
  all: procedure.query(async ({ ctx }) => {
    if (ctx.session && ctx.session.user) {
      const orders = await ctx.prisma.order.findMany({
        where: { user: { email: ctx.session.user.email! } },
        include: {
          payment: true,
          product: true,
          received: true,
          shippingAddress: true,
        },
      });
      return { success: true, orders };
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
  // create: procedure
  //   .input(
  //     z.object({
  //       shippingAddress: z.custom<ZAE_ShippingAddres>(),
  //       products: z.custom<AEProduct[]>(),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     if (ctx.session && ctx.session.user) {
  //       const user = await ctx.prisma.user.findUnique({
  //         where: { email: ctx.session.user.email! },
  //       });
  //       if (user) {
  //         try {
  //           const product_items = input.products.map((product) => {
  //             return {
  //               logistics_service_name: product.carrierId,
  //               order_memo: product.orderMemo,
  //               product_count: product.quantity,
  //               product_id: parseInt(product.productId),
  //               sku_attr: product.sku,
  //             };
  //           });
  //           const result = await ctx.aliexpress.ds.createOrder(
  //             {
  //               address: input.shippingAddress.addressLine1,
  //               city: input.shippingAddress.city,
  //               contact_person: input.shippingAddress.name,
  //               country: input.shippingAddress.countryCode,
  //               full_name: input.shippingAddress.name,
  //               mobile_no: input.shippingAddress.mobilePhone,
  //               phone_country: input.shippingAddress.phoneCountry,
  //               province: input.shippingAddress.province,
  //               zip: input.shippingAddress.zipCode,
  //             },
  //             product_items
  //           );
  //           if (result.result) {
  //             if (result.result.is_success) {
  //               for (const order_id of result.result.order_list) {
  //                 await ctx.prisma.order.create({
  //                   data: {
  //                     id: order_id.toString(),
  //                     userId: user.id,
  //                     shippingAddress: {
  //                       create: input.shippingAddress,
  //                     },
  //                   },
  //                 });
  //               }
  //               return {
  //                 success: true,
  //                 message: "Successfully created your orders.",
  //               };
  //             } else return { success: false, error: result.result.error_msg };
  //           } else
  //             return {
  //               success: false,
  //               error: (result as any).error_response.msg,
  //             };
  //         } catch (error) {
  //           return { success: false, error: JSON.stringify(error) };
  //         }
  //       } else return { success: false, error: "No user was found." };
  //     } else
  //       return {
  //         success: false,
  //         error: "You must be logged in.",
  //       };
  //   }),
  create: procedure
    .input(
      z.object({
        shippingAddress: z.custom<ZAE_ShippingAddres>(),
        products: z.custom<AENOProduct[]>(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        const user = await ctx.prisma.user.findUnique({
          where: { email: ctx.session.user.email! },
        });
        const products: AEProduct[] = input.products.map((product) => ({
          carrierId: product.carrierId,
          productId: product.productId,
          quantity: product.quantity,
          sku: product.sku,
          orderMemo: "",
        }));
        if (user) {
          try {
            const data = await ctx.zapiex.createOrder(
              products,
              input.shippingAddress
            );
            if (data.statusCode === 200) {
              if (data.data.orderIds.length === 1) {
                await ctx.prisma.order.create({
                  data: {
                    id: data.data.orderIds[0].toString(),
                    userId: user.id,
                    shippingAddress: {
                      create: input.shippingAddress,
                    },
                    product: {
                      create: input.products[0],
                    },
                  },
                });
              } else {
                for (const order_id of data.data.orderIds) {
                  const result = await ctx.zapiex.getOrder(order_id.toString());
                  const product = input.products.find(
                    (product) =>
                      product.productId === result.products[0].productId
                  );
                  if (product) {
                    await ctx.prisma.order.create({
                      data: {
                        id: order_id.toString(),
                        userId: user.id,
                        shippingAddress: {
                          create: input.shippingAddress,
                        },
                        product: {
                          create: product,
                        },
                      },
                    });
                  }
                }
              }
              return {
                success: true,
                message: "Successfully created your orders.",
              };
            } else return { success: false, error: `Couldn't create order.` };
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
        if (result.success) {
          await ctx.prisma.order.update({
            where: { id: input.order_id },
            data: {
              cancelled: true,
              shippingAddress: {
                delete: true,
              },
              product: {
                delete: true,
              },
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
  received: procedure
    .input(
      z.object({
        order_id: z.string(),
        package_pic: z.string().optional(),
        rating: z.number().min(1).max(5).optional(),
        feedback: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        if (input.rating || input.feedback) {
          await ctx.prisma.feedback.create({
            data: {
              user: {
                connect: {
                  email: ctx.session.user.email!,
                },
              },
              message: input.feedback,
              rating: input.rating,
            },
          });
        }
        const RECEIVED_OBJECT = {
          date: new Date(),
          wasReceived: true,
          packagePicture: input.package_pic,
        };
        const received = await ctx.prisma.packageReceipt.upsert({
          where: { orderId: input.order_id },
          update: RECEIVED_OBJECT,
          create: { ...RECEIVED_OBJECT, orderId: input.order_id },
        });
        if (received) {
          SendEmail({
            from: "support@reglini-dz.com",
            to: "moh3a@reglini-dz.com",
            subject: `Package received by ${ctx.session.user.email}`,
            text: `
          <h2>
          User with email address ${ctx.session.user.email} has received his package.
          </h2>
          <p>The package is from the order with the ID ${input.order_id}.</p>
          <p>Here's the package received by the client.</p>
          <img alt='payment' src=${input.package_pic} />
          `,
          });
          return {
            success: true,
            message: "Successfully terminated this order.",
          };
        } else return { success: false, error: "An error has occured." };
      } else
        return {
          success: false,
          error: "You must be logged in.",
        };
    }),
});
