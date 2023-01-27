import { GetStaticProps } from "next";
import AliexpressHero from "@components/layout/sections/AliexpressHero";
import CurrencyHero from "@components/layout/sections/CurrencyHero";
import AccountHero from "@components/layout/sections/AccountHero";
import InstallPWASection from "@components/layout/sections/InstallPWASection";

const IndexPage = () => {
  return (
    <section className="overflow-hidden">
      <AliexpressHero />
      <CurrencyHero />
      <AccountHero />
      <InstallPWASection />
    </section>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
};

import Layout from "@components/layout/Layout";
IndexPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default IndexPage;
