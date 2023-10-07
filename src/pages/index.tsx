import {
  InstallPWASection,
  AccountHero,
  AliexpressHero,
  CurrencyHero,
} from "~/components/layout/sections";

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

import type { GetStaticProps } from "next";
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
};

import Layout from "~/components/layout/Layout";
import type { ReactElement } from "react";
IndexPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default IndexPage;
