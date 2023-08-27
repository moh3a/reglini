import { GetStaticProps } from "next";
import Head from "next/head";

import { APP_NAME } from "@config/general";
import { TitleXL } from "@components/shared";

const NotFound = () => {
  return (
    <>
      <Head>
        <title>{"Not Found | " + APP_NAME}</title>
      </Head>
      <TitleXL emoji="😵" title="404 | Not Found" />
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

import Layout from "../components/layout/Layout";
NotFound.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default NotFound;
