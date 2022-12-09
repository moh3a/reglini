import { GetStaticProps } from "next";
import Head from "next/head";

import { APP_NAME } from "@config/general";
import MainSearch from "@components/aliexpress/MainSearch";

const AliexpressPage = () => {
  return (
    <>
      <Head>
        <title>{`Search Aliexpress | ${APP_NAME}`}</title>
      </Head>
      <MainSearch />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const messages = (await import(`../../../locales/${locale}/AliexpressPage.json`))
    .default;
  return {
    props: {
      messages,
    },
  };
};

import Layout from "@components/layout/Layout";
AliexpressPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default AliexpressPage;
