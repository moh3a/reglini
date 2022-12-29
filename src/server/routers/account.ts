import { ACCOUNT_TYPE } from "@prisma/client";
import { USER_FROM_TRPC_CTX } from "@utils/index";
import { createHash } from "crypto";
import { z } from "zod";

import { router, procedure } from "../trpc";

export const accountRouter = router({
  profile: procedure.query(async ({ ctx, input }) => {
    if (ctx.session && ctx.session.user) {
      try {
        const user = await ctx.prisma.user.findFirst({
          where: USER_FROM_TRPC_CTX(ctx.session),
          include: {
            address: true,
            profile: true,
          },
        });
        return {
          success: true,
          user,
        };
      } catch (error) {
        return {
          success: false,
          error: JSON.stringify(error),
        };
      }
    } else
      return {
        success: false,
        error: "You must be logged in.",
      };
  }),
  edit: procedure
    .input(
      z.object({
        field: z.enum(["name", "realName", "phoneNumber", "picture"]),
        value: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        try {
          if (input.field === "name") {
            const user = await ctx.prisma.user.update({
              where: { email: ctx.session.user.email! },
              data: {
                name: input.value,
              },
            });
            if (user)
              return { success: true, message: "Successfully updated." };
            else return { success: false, error: "An error occured." };
          } else {
            const user = await ctx.prisma.user.update({
              where: { email: ctx.session.user.email! },
              data: {
                profile: {
                  update: {
                    [input.field]: input.value,
                  },
                },
              },
            });
            if (user)
              return { success: true, message: "Successfully updated." };
            else return { success: false, error: "An error occured." };
          }
        } catch (error) {
          return {
            success: false,
            error: JSON.stringify(error),
          };
        }
      } else
        return {
          success: false,
          error: "You must be logged in.",
        };
    }),
  verification: procedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        try {
          const verifyCredentialsToken = createHash("sha256")
            .update(input.token)
            .digest("hex");

          const user = await ctx.prisma.user.findFirst({
            where: {
              email: ctx.session.user.email!,
              account: ACCOUNT_TYPE.CREDENTIALS,
              verifyCredentialsToken: verifyCredentialsToken,
              verified: false,
            },
          });
          if (user) {
            await ctx.prisma.user.update({
              where: {
                email: ctx.session.user.email!,
              },
              data: {
                verifyCredentialsToken: undefined,
                verified: true,
              },
            });
            return {
              success: true,
              message: "Account successfully verified!",
            };
          } else
            return {
              success: false,
              message: "Error with session or token.",
            };
        } catch (error) {
          return {
            success: false,
            message: JSON.stringify(error),
          };
        }
      } else
        return {
          success: false,
          message: "You must be logged in.",
        };
    }),
  delete: procedure.mutation(async ({ ctx }) => {
    if (ctx.session && ctx.session.user) {
      try {
        await ctx.prisma.user.delete({
          where: {
            email: ctx.session.user.email!,
          },
        });
        return {
          success: true,
        };
      } catch (error) {
        return {
          success: false,
        };
      }
    } else
      return {
        success: false,
      };
  }),
});
