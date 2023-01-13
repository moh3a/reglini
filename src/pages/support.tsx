import { GetStaticProps } from "next";
import Head from "next/head";
import pick from "lodash/pick";
import { useTranslations } from "next-intl";

import { APP_NAME } from "@config/general";
import Contact from "@components/Contact";

const SupportPage = () => {
  const t = useTranslations("SupportPage");
  return (
    <>
      <Head>
        <title>{`${t("title")} | ` + APP_NAME}</title>
      </Head>
      <Contact />
    </>
  );
};

const namespaces = ["SupportPage", "Common"];
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const messages = pick(
    (await import(`../../messages/${locale}.json`)).default,
    namespaces
  );
  return {
    props: {
      messages,
    },
  };
};

import Layout from "@components/layout/Layout";
SupportPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default SupportPage;
