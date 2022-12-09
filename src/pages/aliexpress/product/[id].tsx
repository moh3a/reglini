import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { APP_NAME } from "@config/general";
import ProductDetails from "@components/aliexpress/ProductDetails";

const AliexpressProductPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>{`Product | Aliexpress | ${APP_NAME}`}</title>
      </Head>
      {id && <ProductDetails id={id as string} />}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const messages = (
    await import(`../../../../locales/${locale}/AliexpressPage.json`)
  ).default;
  return {
    props: {
      messages,
    },
  };
};

import Layout from "@components/layout/Layout";
AliexpressProductPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default AliexpressProductPage;
