import { GetStaticProps } from "next";
import Head from "next/head";

import { APP_NAME } from "@config/general";
import MainSearch from "@components/aliexpress/MainSearch";
import ProductsList from "@components/aliexpress/ProductsList";

const AliexpressPage = () => {
  return (
    <>
      <Head>
        <title>{`Search Aliexpress | ${APP_NAME}`}</title>
      </Head>
      <MainSearch />
      <ProductsList />
    </>
  );
};

import { pick } from "lodash";
const namespaces = ["AliexpressPage", "Common"];
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        (await import(`../../../messages/${locale}.json`)).default,
        namespaces
      ),
    },
  };
};

import Layout from "@components/layout/Layout";
AliexpressPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default AliexpressPage;
