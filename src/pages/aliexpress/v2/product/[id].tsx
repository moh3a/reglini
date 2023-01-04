import Head from "next/head";
import { useRouter } from "next/router";

import { APP_NAME } from "@config/general";
import ProductDetails from "@components/aliexpress_v2/ProductDetails";

const AliexpressProductPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>{`Product | Aliexpress | ${APP_NAME}`}</title>
      </Head>
      {id && <ProductDetails id={parseInt(id.toString())} />}
    </>
  );
};

import Layout from "@components/layout/Layout";
AliexpressProductPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default AliexpressProductPage;
