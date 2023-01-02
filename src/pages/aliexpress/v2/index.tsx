import { GetStaticProps } from "next";
import Head from "next/head";

import Title from "@components/shared/Title";
import { APP_NAME } from "@config/general";

const AliexpressV2Page = () => {
  const router = useRouter();
  const { q, p } = router.query;

  const searchProducts = trpc.aliexpress.affiliate.search.useQuery({
    search: q ? (q as string) : undefined,
    locale: router.locale,
    page_no: parseInt((p as string) ?? "1"),
    page_size: 20,
  });

  return (
    <>
      <Head>
        <title>{`Search Aliexpress | ${APP_NAME}`}</title>
      </Head>
      <Title title="aliexpress api v2 - coming soon" />
      {JSON.stringify(searchProducts.data)}
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
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
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
AliexpressV2Page.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default AliexpressV2Page;
