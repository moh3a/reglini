import { router } from "../trpc";
import { aeAffiliateRouter } from "./aeAffiliate";
import { aeDsRouter } from "./aeDs";

export const aliexpressRouter = router({
  ds: aeDsRouter,
  affiliate: aeAffiliateRouter,
});
