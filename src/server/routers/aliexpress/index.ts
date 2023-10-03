import { router } from "~/server/trpc";
import { aeAffiliateRouter } from "./affiliate";
import { aeDsRouter } from "./ds";

export const aliexpressRouter = router({
  ds: aeDsRouter,
  affiliate: aeAffiliateRouter,
});
