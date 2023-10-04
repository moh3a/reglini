import { router } from "~/server/trpc";
import { aeAffiliateRouter } from "~/server/routers/aliexpress/affiliate";
import { aeDsRouter } from "~/server/routers/aliexpress/ds";

export const aliexpressRouter = router({
  ds: aeDsRouter,
  affiliate: aeAffiliateRouter,
});
