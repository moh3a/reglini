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
import type { ReactElement } from "react";
import pick from "lodash/pick";

import Layout from "../components/layout/Layout";
NotFound.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

NotFound.messages = Layout.messages;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        await import(`../../messages/${locale}.json`),
        NotFound.messages,
      ),
    },
  };
};

export default NotFound;
