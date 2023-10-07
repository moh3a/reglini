import Head from "next/head";
import { useTranslations } from "next-intl";

import { APP_NAME } from "~/config/constants";
import Contact from "~/components/Contact";

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

import type { GetStaticProps } from "next";
import type { ReactElement } from "react";
import pick from "lodash/pick";

import Layout from "~/components/layout/Layout";
SupportPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

SupportPage.messages = ["SupportPage", Layout.messages].flat();

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        await import(`../../messages/${locale}.json`),
        SupportPage.messages,
      ),
    },
  };
};

export default SupportPage;
