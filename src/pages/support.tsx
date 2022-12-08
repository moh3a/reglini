import { GetStaticProps } from "next";
import Head from "next/head";

import { APP_NAME } from "@config/general";
import Contact from "@components/Contact";

const SupportPage = () => {
  return (
    <>
      <Head>
        <title>{`Contact Us | ` + APP_NAME}</title>
      </Head>
      <Contact />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const messages = (await import(`../../locales/${locale}/SupportPage.json`))
    .default;
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
