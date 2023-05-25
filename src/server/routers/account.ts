import { ACCOUNT_TYPE } from "@prisma/client";
import { USER_FROM_TRPC_CTX } from "@utils/index";
import { createHash } from "crypto";
import { z } from "zod";

import { router, procedure } from "../trpc";
import { API_RESPONSE_MESSAGES } from "@config/general";

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
          error: API_RESPONSE_MESSAGES.NOT_FOUND("User"),
        };
      }
    } else
      return {
        success: false,
        error: API_RESPONSE_MESSAGES.LOGGED_IN,
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
            else
              return {
                success: false,
                error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
              };
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
            else
              return {
                success: false,
                error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
              };
          }
        } catch (error) {
          return {
            success: false,
            error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
          };
        }
      } else
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.LOGGED_IN,
        };
    }),
  address: procedure
    .input(
      z.object({
        wilaya: z.string(),
        daira: z.string(),
        commune: z.string(),
        postalCode: z.string(),
        streetName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session && ctx.session.user) {
        const user = await ctx.prisma.user.update({
          where: { email: ctx.session.user.email! },
          data: {
            address: {
              upsert: {
                create: {
                  commune: input.commune,
                  daira: input.daira,
                  postalCode: input.postalCode,
                  streetName: input.streetName,
                  wilaya: input.wilaya,
                },
                update: {
                  commune: input.commune,
                  daira: input.daira,
                  postalCode: input.postalCode,
                  streetName: input.streetName,
                  wilaya: input.wilaya,
                },
              },
            },
          },
        });
        if (user) return { success: true, message: "Successfully updated." };
        else
          return {
            success: false,
            error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
          };
      } else
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.LOGGED_IN,
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
              error: "Error with session or token.",
            };
        } catch (error) {
          return {
            success: false,
            error: "Error with the verification.",
          };
        }
      } else
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.LOGGED_IN,
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
