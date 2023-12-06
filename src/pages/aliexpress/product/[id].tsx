import { useRouter } from "next/router";

import { ProductDetails } from "~/components/aliexpress";

const AliexpressProductPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <h1 className="text-center py-6">Currently in maintenance</h1>
  // return <>{id && <ProductDetails id={id.toString()} />}</>;
};

import type { GetServerSideProps } from "next";
import pick from "lodash/pick";
import Layout from "~/components/layout/Layout";

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
