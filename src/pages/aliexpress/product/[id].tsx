import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

import ProductDetails from "@components/aliexpress_v2/ProductDetails";

const AliexpressProductPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <>{id && <ProductDetails id={parseInt(id.toString())} />}</>;
};

import { pick } from "lodash";
const namespaces = ["AliexpressPage", "Common"];
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        (await import(`../../../../messages/${locale}.json`)).default,
        namespaces
      ),
    },
  };
};

import Layout from "@components/layout/Layout";
AliexpressProductPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default AliexpressProductPage;
