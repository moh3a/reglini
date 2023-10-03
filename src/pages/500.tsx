import { GetStaticProps } from "next";
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
};

import Layout from "../components/layout/Layout";
InternalError.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default InternalError;
