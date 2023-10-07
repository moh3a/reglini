import { useEffect, type ReactElement } from "react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { APP_NAME } from "~/config/constants";
import OrderDetails from "~/components/account/orders/OrderDetails";

const OrderDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") void router.replace("/");
  }, [router, status]);

  return (
    <>
      <Head>
        <title>{`Order ${id} details | ${APP_NAME}`}</title>
      </Head>
      {id && <OrderDetails id={id.toString()} />}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
};

import Layout from "~/components/layout/Layout";
OrderDetailsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default OrderDetailsPage;
