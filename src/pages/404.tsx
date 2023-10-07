import Head from "next/head";

import { APP_NAME } from "~/config/constants";
import { TitleXL } from "~/components/shared";

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

import type { GetStaticProps } from "next";
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
};

import Layout from "../components/layout/Layout";
import type { ReactElement } from "react";
NotFound.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default NotFound;
