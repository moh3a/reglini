import { useState, type ReactNode, useEffect } from "react";

import Finance from "~/components/Finance";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import { Toast } from "~/components/shared";
import { useFinance, useMessage } from "~/utils/store";

const Layout = ({ children }: { children: ReactNode }) => {
  const { commission, euro, usd } = useFinance();
  const { text, type, resetMessage } = useMessage();

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <>
      <Navbar />
      {isHydrated && (!commission || !euro || !usd) && <Finance />}
      <main className={`mb-2 min-h-[350px]`}>{children}</main>
      {type && text && (
        <Toast type={type} onClose={() => resetMessage()}>
          {text}
        </Toast>
      )}
      <Footer />
    </>
  );
};

Layout.messages = ["Common"];

export default Layout;
