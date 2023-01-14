import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

import ProductDetails from "@components/aliexpress/ProductDetails";

const AliexpressProductPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <>{id && <ProductDetails id={id as string} />}</>;
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../../../../messages/${locale}.json`))
        .default,
    },
  };
};

import Layout from "@components/layout/Layout";
AliexpressProductPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default AliexpressProductPage;
