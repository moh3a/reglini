import { GetStaticProps } from "next";
import Head from "next/head";

import { APP_NAME } from "@config/general";
import Currency from "@components/currency";

const CurrencyPage = () => {
  return (
    <>
      <Head>
        <title>{`Currency exchange in the algerian market | ${APP_NAME}`}</title>
      </Head>
      <Currency />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const messages = (await import(`../../locales/${locale}/CurrencyPage.json`))
    .default;
  return {
    props: {
      messages,
    },
  };
};

import Layout from "@components/layout/Layout";
CurrencyPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default CurrencyPage;
