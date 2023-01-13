import { GetStaticProps } from "next";
import Head from "next/head";
import { APP_NAME } from "@config/general";
import { TEXT_GRADIENT } from "@config/design";

const NotFound = () => {
  return (
    <>
      <Head>
        <title>{"Not Found | " + APP_NAME}</title>
      </Head>
      <div className="flex-col text-center mt-28">
        <div className="text-6xl font-extrabold select-none">
          <span className={TEXT_GRADIENT}>404 | Not Found</span> 😵
        </div>
      </div>
    </>
  );
};

import { pick } from "lodash";
const namespaces = ["Common"];
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        (await import(`../../messages/${locale}.json`)).default,
        namespaces
      ),
    },
  };
};

import Layout from "../components/layout/Layout";
NotFound.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default NotFound;
