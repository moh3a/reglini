import { ROLES } from "@prisma/client";
import { procedure, router } from "../trpc";
import { aeAffiliateRouter } from "./aeAffiliate";
import { aeDsRouter } from "./aeDs";

export const aliexpressRouter = router({
  ds: aeDsRouter,
  affiliate: aeAffiliateRouter,
  auth: procedure.query(async ({ ctx, input }) => {
    if (ctx.session && ctx.session.user) {
      const admin = await ctx.prisma.user.findFirst({
        where: {
          email: ctx.session.user.email!,
          role: ROLES.ADMIN,
        },
      });
      if (admin) {
        return {
          success: true,
          url: `https://oauth.aliexpress.com/authorize?response_type=code&client_id=${process.env.ALIEXPRESS_DS_APP_KEY}&sp=ae&redirect_uri=${process.env.NEXTAUTH_URL}/api/aliexpress/auth/callback`,
          message: `Process for Aliexpress authentication started. Checkout this link.`,
        };
      } else {
        return {
          success: false,
          message: "You are not authorized to do this action.",
        };
      }
    } else
      return {
        success: false,
        message: "You must be logged in.",
      };
  }),
});
