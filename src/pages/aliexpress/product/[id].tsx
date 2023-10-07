import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";

import { ProductDetails } from "~/components/aliexpress";

const AliexpressProductPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <>{id && <ProductDetails id={id.toString()} />}</>;
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
};

import Layout from "~/components/layout/Layout";
import type { ReactElement } from "react";
AliexpressProductPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AliexpressProductPage;
