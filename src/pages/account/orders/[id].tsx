import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { APP_NAME } from "~/config/constants";
import OrderDetails from "~/components/account/orders/OrderDetails";

const OrderDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  useSession({
    required: true,
    onUnauthenticated() {
      void router.replace("/");
    },
  });

  return (
    <>
      <Head>
        <title>{`Order ${id?.toString()} details | ${APP_NAME}`}</title>
      </Head>
      <h1 className="py-6 text-center">Currently in maintenance</h1>
      {/* {id && <OrderDetails id={id.toString()} />} */}
    </>
  );
};

import Layout from "~/components/layout/Layout";
import pick from "lodash/pick";

OrderDetailsPage.messages = ["AccountPage.orders", Layout.messages].flat();

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        await import(`../../../../messages/${locale}.json`),
        OrderDetailsPage.messages,
      ),
    },
  };
};

export default OrderDetailsPage;
