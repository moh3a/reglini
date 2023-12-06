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
      <h1 className="text-center py-6">Currently in maintenance</h1>
      {/* <MainSearch />
      <ProductsList /> */}
    </>
  );
};

import type { GetStaticProps } from "next";
import pick from "lodash/pick";
import Layout from "~/components/layout/Layout";

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
