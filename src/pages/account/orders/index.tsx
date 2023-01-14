import { useEffect } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { APP_NAME } from "@config/general";
import ListOrders from "@components/account/orders/ListOrders";

const AllOrdersPage = () => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/");
  }, [router, status]);

  return (
    <>
      <Head>
        <title>{`List all orders | ${APP_NAME}`}</title>
      </Head>
      <ListOrders />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
};

import Layout from "@components/layout/Layout";
AllOrdersPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default AllOrdersPage;
