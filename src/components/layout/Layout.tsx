import { ReactNode } from "react";

import Navbar from "./Navbar";
import { useFinance } from "@utils/store";
import { trpc } from "@utils/trpc";

const Layout = ({ children }: { children: ReactNode }) => {
  const { set_currency, set_commission } = useFinance();
  trpc.commission.useQuery(undefined, {
    onSettled(data) {
      if (data && data.commission) {
        set_commission(data.commission);
      }
    },
  });
  trpc.currency.currenciesObject.useQuery(undefined, {
    onSettled(data) {
      if (data && data.currencies) {
        set_currency("EUR", data.currencies?.eur.parallel_sale ?? 0);
        set_currency("USD", data.currencies?.usd.parallel_sale ?? 0);
      }
    },
  });

  return (
    <>
      <Navbar />
      <main className="mb-2">{children}</main>
    </>
  );
};

export default Layout;
