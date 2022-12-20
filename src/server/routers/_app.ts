import { procedure, router } from "../trpc";
import { z } from "zod";

import SendEmail from "@utils/send_email";
import { authRouter } from "./auth";
import { currencyRouter } from "./currency";
import { accountRouter } from "./account";
import { wishlistRouter } from "./wishlist";
import { addressRouter } from "./address";
import { aliexpressRouter } from "./aliexpress";
import { zapiexRouter } from "./zapiex";
import { cartRouter } from "./cart";
import { orderRouter } from "./order";

export const appRouter = router({
  email: procedure
    .input(
      z.object({
        message: z.string(),
        subject: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      try {
        const userinfo =
          ctx.session && ctx.session.user
            ? `
            <h2>username: ${ctx.session.user.name}</h2>
            <h3>email: ${ctx.session.user.email}</h3>
            <h3>account type: ${ctx.session.user.type}</h3>`
            : ``;
        const text = `<h3>A client in reglini-dz have sent this email.</h3>${userinfo}<div>${input.message}</div>`;
        SendEmail({
          from: process.env.SENDGRID_FROM,
          to: "admin@reglini-dz.com",
          subject: input.subject,
          text,
        });
        return {
          success: true,
          message: `Your message was sent successfully.`,
        };
      } catch (error) {
        return { success: false, message: JSON.stringify(error) };
      }
    }),
  commission: procedure.mutation(async ({ ctx }) => {
    const config = await ctx.prisma.config.findUnique({
      where: { id: "config" },
      select: { commission: true },
    });
    if (config && config.commission)
      return { success: true, commission: config.commission };
    else return { success: false };
  }),
  auth: authRouter,
  currency: currencyRouter,
  account: accountRouter,
  order: orderRouter,
  wishlist: wishlistRouter,
  cart: cartRouter,
  address: addressRouter,
  aliexpress: aliexpressRouter,
  zapiex: zapiexRouter,
});

export type AppRouter = typeof appRouter;
