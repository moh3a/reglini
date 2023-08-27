import { z } from "zod";

import { Product } from "@prisma/client";
import type {
  AENOLogisticsAddress,
  AENOProduct,
  AENOProductItem,
} from "@reglini-types/index";
import type { ZAE_ShippingAddres } from "@reglini-types/zapiex";
import { router, procedure } from "../trpc";
import SendEmail from "@utils/send_email";
import { API_RESPONSE_MESSAGES } from "@config/general";
import { USER_FROM_TRPC_CTX } from "@utils/index";

export const orderRouter = router({
  all: procedure.query(async ({ ctx }) => {
    if (ctx.session && ctx.session.user) {
      const orders = await ctx.prisma.order.findMany({
        where: { user: USER_FROM_TRPC_CTX(ctx.session) },
        orderBy: {
          date: "desc",
        },
        include: {
          payment: true,
          products: true,
          received: true,
          shippingAddress: true,
        },
      });
      return { success: true, orders };
    } else
      return {
        success: false,
        error: API_RESPONSE_MESSAGES.LOGGED_IN,
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
          } else
            return {
              success: false,
              error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
            };
        } else
          return {
            success: false,
            error: API_RESPONSE_MESSAGES.NOT_FOUND("User"),
          };
      } else
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.LOGGED_IN,
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
            products: true,
            received: true,
            shippingAddress: true,
          },
        });
        return { success: true, order };
      } else
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.LOGGED_IN,
        };
    }),
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
        if (user) {
          try {
            // const products: AEProduct[] = input.products.map((product) => ({
            //   carrierId: product.carrierId,
            //   productId: product.productId,
            //   quantity: product.quantity,
            //   sku: product.sku,
            //   orderMemo: "",
            // }));
            // const data = await ctx.zapiex.createOrder(
            //   products,
            //   input.shippingAddress
            // );
            const product_items: AENOProductItem[] = input.products.map(
              (product) => {
                return {
                  logistics_service_name: product.carrierId,
                  order_memo: product.orderMemo ?? "",
                  product_count: product.quantity,
                  product_id: parseInt(product.productId),
                  sku_attr: product.sku,
                };
              }
            );
            const logistics_address: AENOLogisticsAddress = {
              address: input.shippingAddress.addressLine1,
              city: input.shippingAddress.city,
              contact_person: input.shippingAddress.name,
              country: input.shippingAddress.countryCode,
              full_name: input.shippingAddress.name,
              mobile_no: input.shippingAddress.mobilePhone,
              phone_country: input.shippingAddress.phoneCountry,
              province: input.shippingAddress.province,
              zip: input.shippingAddress.zipCode,
            };
            const result = await ctx.aliexpress.ds.createOrder(
              logistics_address,
              product_items
            );

            if (result.result) {
              if (result.result.is_success) {
                for (const order_id of result.result.order_list) {
                  const order = await ctx.aliexpress.ds.getOrder(order_id);
                  let products: Omit<
                    Product,
                    "orderId" | "id" | "properties"
                  >[] = [];
                  if (input.products.length === 1) {
                    products.push(input.products[0]);
                  } else if (input.products.length > 1) {
                    order.result.child_order_list.forEach((o) => {
                      const prdct = input.products.find(
                        (p) => p.productId === o.product_id.toString()
                      );
                      if (prdct) products.push(prdct);
                    });
                  }
                  await ctx.prisma.order.create({
                    data: {
                      id: order_id.toString(),
                      userId: user.id,
                      shippingAddress: {
                        create: input.shippingAddress,
                      },
                      products: {
                        createMany: {
                          data: products,
                        },
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
                error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
              };
          } catch (error) {
            console.log(error);
            return {
              success: false,
              error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
            };
          }
        } else
          return {
            success: false,
            error: API_RESPONSE_MESSAGES.NOT_FOUND("User"),
          };
      } else
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.LOGGED_IN,
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
        } else
          return { success: false, error: API_RESPONSE_MESSAGES.ERROR_OCCURED };
      } else
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.LOGGED_IN,
        };
    }),
  cancel: procedure
    .input(z.object({ order_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        const order = await ctx.prisma.order.findUnique({
          where: { id: input.order_id },
          select: { user: { select: { email: true } } },
        });
        if (order?.user.email === ctx.session.user.email) {
          const result = await ctx.zapiex.cancelOrder(input.order_id);
          if (result.success) {
            await ctx.prisma.order.update({
              where: { id: input.order_id },
              data: {
                cancelled: true,
                shippingAddress: {
                  delete: true,
                },
                products: {
                  deleteMany: {},
                },
              },
            });
            return {
              success: true,
              message: "Successfully cancelled this order.",
            };
          } else
            return {
              success: false,
              error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
            };
        }
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.UNAUTHORIZED,
        };
      } else
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.LOGGED_IN,
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
        } else
          return { success: false, error: API_RESPONSE_MESSAGES.ERROR_OCCURED };
      } else
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.LOGGED_IN,
        };
    }),
});
