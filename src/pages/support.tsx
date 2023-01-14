import { GetStaticProps } from "next";
import Head from "next/head";
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
};

import Layout from "@components/layout/Layout";
SupportPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default SupportPage;
