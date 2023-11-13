import { useState, type ReactNode, useEffect } from "react";

import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import Finance from "~/components/Finance";
import { useFinance } from "~/utils/store";

const Layout = ({ children }: { children: ReactNode }) => {
  const { commission, euro, usd } = useFinance();

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <>
      <Navbar />
      {isHydrated && (!commission || !euro || !usd) && <Finance />}
      <main className={`mb-2 min-h-[350px]`}>{children}</main>
      <Footer />
    </>
  );
};

Layout.messages = ["Common"];

export default Layout;
