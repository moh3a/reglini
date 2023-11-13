import type { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { APP_NAME } from "~/config/constants";
import ListOrders from "~/components/account/orders/ListOrders";

const AllOrdersPage = () => {
  const router = useRouter();
  useSession({
    required: true,
    onUnauthenticated() {
      void router.replace("/");
    },
  });

  return (
    <>
      <Head>
        <title>{`List all orders | ${APP_NAME}`}</title>
      </Head>
      <ListOrders />
    </>
  );
};

import Layout from "~/components/layout/Layout";
import pick from "lodash/pick";

AllOrdersPage.messages = ["AccountPage.orders", Layout.messages].flat();

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        await import(`../../../../messages/${locale}.json`),
        AllOrdersPage.messages,
      ),
    },
  };
};

export default AllOrdersPage;
