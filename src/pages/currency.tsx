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
import type { ReactElement } from "react";
import pick from "lodash/pick";

import Layout from "~/components/layout/Layout";
CurrencyPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

CurrencyPage.messages = ["CurrencyPage", Layout.messages].flat();

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        await import(`../../messages/${locale}.json`),
        CurrencyPage.messages,
      ),
    },
  };
};

export default CurrencyPage;
