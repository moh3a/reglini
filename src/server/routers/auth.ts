import { createHash, randomBytes } from "crypto";
import { z } from "zod";

import { router, procedure } from "../trpc";
import SendEmail from "@utils/send_email";
import { genSaltSync, hashSync } from "bcrypt";
import { API_RESPONSE_MESSAGES } from "@config/general";

export const authRouter = router({
  checkEmail: procedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (user) {
        return {
          success: true,
          exists: true,
        };
      } else return { success: true, exists: false };
    }),
  forgotPasswordHandler: procedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const token = randomBytes(20).toString("hex");
      const user = await ctx.prisma.user.update({
        where: { email: input.email },
        data: {
          resetPasswordToken: createHash("sha256").update(token).digest("hex"),
          resetPasswordExpire: (Date.now() + 10 * (60 * 1000)).toString(),
        },
      });
      if (user) {
        const envUrl = process.env.NEXTAUTH_URL;
        const resetUrl = `${envUrl}/auth/resetpassword/${token}`;
        const message = `
          <h1>You have requested a password reset</h1>
          <p>Please go to <a href=${resetUrl} clicktracking='off'>this link</a> to reset the password.</p>
          `;
        try {
          SendEmail({
            from: process.env.SENDGRID_FROM,
            to: user.email,
            subject: "Password Reset Request",
            text: message,
          });
          return {
            success: true,
            message: "Email successfully sent.",
          };
        } catch (error) {
          await ctx.prisma.user.update({
            where: { email: input.email },
            data: {
              resetPasswordToken: undefined,
              resetPasswordExpire: undefined,
            },
          });
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
    }),
  resetPassword: procedure
    .input(z.object({ token: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const resetPasswordToken = createHash("sha256")
        .update(input.token)
        .digest("hex");
      const user = await ctx.prisma.user.findFirst({
        where: {
          resetPasswordToken,
          resetPasswordExpire: {
            gt: new Date().toISOString(),
          },
        },
      });
      if (user) {
        try {
          const salt = genSaltSync();
          let password = hashSync(input.password, salt);
          await ctx.prisma.user.update({
            where: { id: user.id },
            data: {
              resetPasswordExpire: undefined,
              resetPasswordToken: undefined,
              password,
            },
          });
          return {
            success: true,
            message: "Successfully reset your password.",
          };
        } catch (error) {
          return {
            success: false,
            error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
          };
        }
      } else
        return {
          success: false,
          error: "Invalid reset token.",
        };
    }),
});
