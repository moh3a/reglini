import { useEffect } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { APP_NAME } from "@config/general";
import OrderDetails from "@components/account/orders/OrderDetails";

const OrderDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/");
  }, [router, status]);

  return (
    <>
      <Head>
        <title>{`Order details | ${APP_NAME}`}</title>
      </Head>
      {id && <OrderDetails id={id.toString()} />}
    </>
  );
};

import { pick } from "lodash";
const namespaces = ["Common"];
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
OrderDetailsPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default OrderDetailsPage;
