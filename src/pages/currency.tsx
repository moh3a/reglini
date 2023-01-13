import { GetStaticProps } from "next";
import Head from "next/head";
import { useTranslations } from "next-intl";

import { APP_NAME } from "@config/general";
import Currency from "@components/currency";

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

import { pick } from "lodash";
const namespaces = ["CurrencyPage", "Common"];
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        (await import(`../../messages/${locale}.json`)).default,
        namespaces
      ),
    },
  };
};

import Layout from "@components/layout/Layout";
CurrencyPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default CurrencyPage;
