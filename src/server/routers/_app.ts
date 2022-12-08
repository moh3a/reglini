import { procedure, router } from "../trpc";
import { z } from "zod";

import { authRouter } from "./auth";
import { currencyRouter } from "./currency";
import { accountRouter } from "./account";
import { addressRouter } from "./address";

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text}`,
      };
    }),
  auth: authRouter,
  currency: currencyRouter,
  account: accountRouter,
  address: addressRouter,
});

export type AppRouter = typeof appRouter;
