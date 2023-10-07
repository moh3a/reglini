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
import type { ReactElement } from "react";
import pick from "lodash/pick";

import Layout from "~/components/layout/Layout";
IndexPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

IndexPage.messages = ["IndexPage", Layout.messages].flat();

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        await import(`../../messages/${locale}.json`),
        IndexPage.messages,
      ),
    },
  };
};

export default IndexPage;
