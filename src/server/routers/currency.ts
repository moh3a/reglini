import { CURRENCIES } from "@prisma/client";

import { router, procedure } from "../trpc";

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
          error: "Error.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: JSON.stringify(error),
      };
    }
  }),
  currenciesObject: procedure.query(async ({ ctx, input }) => {
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
          error: "Error.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: JSON.stringify(error),
      };
    }
  }),
});
