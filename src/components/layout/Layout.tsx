import { ReactNode, useCallback, useEffect } from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { useFinance } from "@utils/store";
import { trpc } from "@utils/trpc";

const Layout = ({ children }: { children: ReactNode }) => {
  const { set_currency, set_commission, commission, euro, usd } = useFinance();

  const commissionMutation = trpc.commission.useMutation();
  const currenciesMutation = trpc.currency.currenciesObject.useMutation();

  const fetchFinance = useCallback(async () => {
    if (!commission)
      await commissionMutation.mutateAsync(undefined, {
        onSettled(data) {
          if (data && data.commission) {
            set_commission(data.commission);
          }
        },
      });
    if (!euro || !usd)
      await currenciesMutation.mutateAsync(undefined, {
        onSettled(data) {
          if (data && data.currencies) {
            set_currency("EUR", data.currencies?.eur.parallel_sale ?? 0);
            set_currency("USD", data.currencies?.usd.parallel_sale ?? 0);
          }
        },
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commission, euro, usd]);

  useEffect(() => {
    fetchFinance();
  }, [fetchFinance]);

  return (
    <>
      <Navbar />
      <main className={`mb-2 min-h-[350px]`}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
