import { CURRENCIES } from "@prisma/client";

import { router, procedure } from "~/server/trpc";
import { API_RESPONSE_MESSAGES } from "~/config/constants";

export const currencyRouter = router({
  currencies: procedure.query(async ({ ctx }) => {
    try {
      const currencies = await ctx.db.$transaction([
        ctx.db.currency.findFirst({
          where: {
            exchange: CURRENCIES.EUR,
          },
          orderBy: {
            date: "desc",
          },
        }),
        ctx.db.currency.findFirst({
          where: {
            exchange: CURRENCIES.GBP,
          },
          orderBy: {
            date: "desc",
          },
        }),
        ctx.db.currency.findFirst({
          where: {
            exchange: CURRENCIES.USD,
          },
          orderBy: {
            date: "desc",
          },
        }),
      ]);
      if (currencies) {
        return {
          success: true,
          currencies,
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
      const currencies = await ctx.db.$transaction([
        ctx.db.currency.findFirst({
          where: {
            exchange: CURRENCIES.EUR,
          },
          orderBy: {
            date: "desc",
          },
        }),
        ctx.db.currency.findFirst({
          where: {
            exchange: CURRENCIES.GBP,
          },
          orderBy: {
            date: "desc",
          },
        }),
        ctx.db.currency.findFirst({
          where: {
            exchange: CURRENCIES.USD,
          },
          orderBy: {
            date: "desc",
          },
        }),
      ]);
      if (currencies) {
        return {
          success: true,
          currencies: {
            eur: currencies[0],
            gbp: currencies[1],
            usd: currencies[2],
          },
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
