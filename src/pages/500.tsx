import Head from "next/head";

import { APP_NAME } from "~/config/constants";
import { TitleXL } from "~/components/shared";

const InternalError = () => {
  return (
    <>
      <Head>
        <title>{"Internal Server Error | " + APP_NAME}</title>
      </Head>
      <TitleXL emoji={"😱"} title={"500 | Internal Server Error"} />
    </>
  );
};

import type { GetStaticProps } from "next";
import type { ReactElement } from "react";
import pick from "lodash/pick";

import Layout from "../components/layout/Layout";
InternalError.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

InternalError.messages = Layout.messages;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        await import(`../../messages/${locale}.json`),
        InternalError.messages,
      ),
    },
  };
};

export default InternalError;
