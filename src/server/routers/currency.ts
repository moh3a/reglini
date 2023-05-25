import { CURRENCIES } from "@prisma/client";

import { router, procedure } from "../trpc";
import { API_RESPONSE_MESSAGES } from "@config/general";

export const currencyRouter = router({
  currencies: procedure.query(async ({ ctx, input }) => {
    try {
      const eur = await ctx.prisma.currency.findFirst({
        where: {
          exchange: CURRENCIES.EUR,
        },
        orderBy: {
          date: "desc",
        },
      });
      const gbp = await ctx.prisma.currency.findFirst({
        where: {
          exchange: CURRENCIES.GBP,
        },
        orderBy: {
          date: "desc",
        },
      });
      const usd = await ctx.prisma.currency.findFirst({
        where: {
          exchange: CURRENCIES.USD,
        },
        orderBy: {
          date: "desc",
        },
      });
      if (eur && gbp && usd) {
        return {
          success: true,
          currencies: [eur, gbp, usd],
        };
      } else {
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
        };
      }
    } catch (_) {
      return {
        success: false,
        error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
      };
    }
  }),
  currenciesObject: procedure.mutation(async ({ ctx }) => {
    try {
      const eur = await ctx.prisma.currency.findFirst({
        where: {
          exchange: CURRENCIES.EUR,
        },
        orderBy: {
          date: "desc",
        },
      });
      const gbp = await ctx.prisma.currency.findFirst({
        where: {
          exchange: CURRENCIES.GBP,
        },
        orderBy: {
          date: "desc",
        },
      });
      const usd = await ctx.prisma.currency.findFirst({
        where: {
          exchange: CURRENCIES.USD,
        },
        orderBy: {
          date: "desc",
        },
      });
      if (eur && gbp && usd) {
        return {
          success: true,
          currencies: { eur, gbp, usd },
        };
      } else {
        return {
          success: false,
          error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
        };
      }
    } catch (_) {
      return {
        success: false,
        error: API_RESPONSE_MESSAGES.ERROR_OCCURED,
      };
    }
  }),
});
