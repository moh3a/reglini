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

import Layout from "~/components/layout/Layout";
SupportPage.messages = ["SupportPage", Layout.messages].flat();

import pick from "lodash/pick";
import type { GetStaticProps } from "next";
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
