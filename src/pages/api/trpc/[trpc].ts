import * as trpcNext from "@trpc/server/adapters/next";
import { createTRPCContext } from "~/server/trpc";
import { type AppRouter, appRouter } from "~/server/routers/_app";

export default trpcNext.createNextApiHandler<AppRouter>({
  router: appRouter,
  /**
   * @link https://trpc.io/docs/context
   */
  createContext: createTRPCContext,
  /**
   * @link https://trpc.io/docs/error-handling
   */
  onError({ error }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      console.error("😱 Something went wrong", error);
    }
  },
  /**
   * Enable query batching
   */
  batching: {
    enabled: true,
  },
});
