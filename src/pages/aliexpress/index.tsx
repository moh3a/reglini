import type { GetStaticProps } from "next";
import Head from "next/head";

import { APP_NAME } from "~/config/constants";
import { MainSearch, ProductsList } from "~/components/aliexpress";

const AliexpressPage = () => {
  const t = useTranslations("Common.aliexpress");
  return (
    <>
      <Head>
        <title>{`${t("search")} | ${APP_NAME}`}</title>
      </Head>
      <MainSearch />
      <ProductsList />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
};

import Layout from "~/components/layout/Layout";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
AliexpressPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AliexpressPage;
