import { ONE_DAY_IN_SECONDS } from "~/utils";
import { api } from "~/utils/api";
import { useFinance } from "~/utils/store";

const Finance = () => {
  const { set_commission, set_currency } = useFinance();

  api.commission.useQuery(undefined, {
    cacheTime: ONE_DAY_IN_SECONDS,
    keepPreviousData: true,
    onSettled(data) {
      if (data?.commission) set_commission(data.commission);
    },
  });

  api.currency.currencies.useQuery(undefined, {
    cacheTime: ONE_DAY_IN_SECONDS,
    keepPreviousData: true,
    onSettled(data) {
      if (data?.success && data?.currencies && data?.currencies.length > 0) {
        for (const c of data.currencies) {
          if (c?.exchange === "EUR") set_currency("EUR", c?.parallel_sale ?? 0);
          if (c?.exchange === "USD") set_currency("USD", c?.parallel_sale ?? 0);
        }
      }
    },
  });

  return <></>;
};

export default Finance;
