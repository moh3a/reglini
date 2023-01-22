import { GetStaticProps } from "next";
import Head from "next/head";
import { APP_NAME } from "@config/general";
import { TEXT_GRADIENT } from "@config/design";

const OfflinePage = () => {
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
      </Head>
      <div className="flex-col text-center mt-28">
        <div className="text-6xl font-extrabold select-none">
          <span className={TEXT_GRADIENT}>Uh oh... you are offline!</span> 😐
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
OfflinePage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default OfflinePage;
