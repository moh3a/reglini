import Head from "next/head";
import { useTranslations } from "next-intl";

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

import type { ReactElement } from "react";
import type { GetStaticProps } from "next";
import pick from "lodash/pick";

import Layout from "~/components/layout/Layout";
AliexpressPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

AliexpressPage.messages = ["AliexpressPage", Layout.messages].flat();

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        await import(`../../../messages/${locale}.json`),
        AliexpressPage.messages,
      ),
    },
  };
};

export default AliexpressPage;
