import { GetStaticProps } from "next";
import HomeHero from "@components/layout/sections/HomeHero";

const IndexPage = () => {
  return <HomeHero />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
};

import Layout from "@components/layout/Layout";
IndexPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default IndexPage;
