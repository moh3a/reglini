import { useRouter } from "next/router";

import { ProductDetails } from "~/components/aliexpress";

const AliexpressProductPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <>{id && <ProductDetails id={id.toString()} />}</>;
};

import type { ReactElement } from "react";
import type { GetServerSideProps } from "next";
import pick from "lodash/pick";

import Layout from "~/components/layout/Layout";
AliexpressProductPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

AliexpressProductPage.messages = ["AliexpressPage", Layout.messages].flat();

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        await import(`../../../../messages/${locale}.json`),
        AliexpressProductPage.messages,
      ),
    },
  };
};

export default AliexpressProductPage;
