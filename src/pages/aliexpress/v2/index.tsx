import { GetStaticProps } from "next";
import Head from "next/head";

import Title from "@components/shared/Title";
import { APP_NAME } from "@config/general";

const AliexpressV2Page = () => {
  return (
    <>
      <Head>
        <title>{`Search Aliexpress | ${APP_NAME}`}</title>
      </Head>
      <Title title="aliexpress api v2 - coming soon" />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const messages = (
    await import(`../../../../locales/${locale}/AliexpressPage.json`)
  ).default;
  return {
    props: {
      messages,
    },
  };
};

import Layout from "@components/layout/Layout";
AliexpressV2Page.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default AliexpressV2Page;
