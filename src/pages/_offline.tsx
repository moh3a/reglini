import type { GetStaticProps } from "next";
import Head from "next/head";
import { APP_NAME } from "~/config/constants";
import { TEXT_GRADIENT } from "~/config/design";

const OfflinePage = () => {
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
      </Head>
      <div className="mt-28 flex-col text-center">
        <div className="select-none text-6xl font-extrabold">
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
import type { ReactElement } from "react";
OfflinePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default OfflinePage;
