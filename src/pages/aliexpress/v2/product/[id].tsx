import Head from "next/head";
import { useRouter } from "next/router";

import { APP_NAME } from "@config/general";
import { trpc } from "@utils/trpc";
import Title from "@components/shared/Title";

const AliexpressProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const getProductId = trpc.aliexpress.product.useQuery({
    id: parseInt(id as string),
    locale: router.locale,
  });

  return (
    <>
      <Head>
        <title>{`Product | Aliexpress | ${APP_NAME}`}</title>
      </Head>
      <Title title="aliexpress api v2 - coming soon" />
      {id && <div>{JSON.stringify(getProductId.data)} </div>}
    </>
  );
};

import Layout from "@components/layout/Layout";
AliexpressProductPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default AliexpressProductPage;
