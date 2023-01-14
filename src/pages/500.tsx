import { GetStaticProps } from "next";
import Head from "next/head";
import { APP_NAME } from "@config/general";
import { TEXT_GRADIENT } from "@config/design";

const InternalError = () => {
  return (
    <>
      <Head>
        <title>{"Internal Server Error | " + APP_NAME}</title>
      </Head>
      <div className="flex-col text-center mt-28">
        <div className="text-6xl font-extrabold select-none">
          <span className={TEXT_GRADIENT}>500 | Internal Server Error</span> 😱
        </div>
      </div>
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
