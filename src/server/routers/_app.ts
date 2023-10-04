import { procedure, router } from "~/server/trpc";
import { z } from "zod";

import { API_RESPONSE_MESSAGES } from "~/config/constants";
import SendEmail from "~/utils/send_email";
import { authRouter } from "~/server/routers/auth";
import { currencyRouter } from "~/server/routers/currency";
import { accountRouter } from "~/server/routers/account";
import { wishlistRouter } from "~/server/routers/wishlist";
import { addressRouter } from "~/server/routers/address";
import { aliexpressRouter } from "~/server/routers/aliexpress";
import { cartRouter } from "~/server/routers/cart";
import { orderRouter } from "~/server/routers/order";

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
          ctx.session?.user
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
        return { success: false, error: API_RESPONSE_MESSAGES.ERROR_OCCURED };
      }
    }),
  commission: procedure.mutation(async ({ ctx }) => {
    const config = await ctx.db.config.findUnique({
      where: { id: "config" },
      select: { commission: true },
    });
    if (config?.commission)
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
});

export type AppRouter = typeof appRouter;
