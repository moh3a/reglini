import { ReactNode } from "react";
import { useRouter } from "next/router";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { useFinance } from "@utils/store";
import { trpc } from "@utils/trpc";

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
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
      <main
        className={`mb-2 min-h-[350px] ${
          router.locale === "ar" ? "text-right" : "text-left"
        } `}
      >
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
