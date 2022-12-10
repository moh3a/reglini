import { procedure, router } from "../trpc";
import { z } from "zod";

import SendEmail from "@utils/send_email";
import { authRouter } from "./auth";
import { currencyRouter } from "./currency";
import { accountRouter } from "./account";
import { addressRouter } from "./address";
import { aliexpressRouter } from "./aliexpress";
import { zapiexRouter } from "./zapiex";

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
  auth: authRouter,
  currency: currencyRouter,
  account: accountRouter,
  address: addressRouter,
  aliexpress: aliexpressRouter,
  zapiex: zapiexRouter,
});

export type AppRouter = typeof appRouter;
