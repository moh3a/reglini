import Head from "next/head";
import { useTranslations } from "next-intl";

import { APP_NAME } from "~/config/constants";
import Currency from "~/components/currency";

const CurrencyPage = () => {
  const t = useTranslations("CurrencyPage");
  return (
    <>
      <Head>
        <title>{`${t("title")} | ${APP_NAME}`}</title>
      </Head>
      <Currency />
    </>
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
CurrencyPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CurrencyPage;
