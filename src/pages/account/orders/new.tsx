import { useEffect, type ReactElement } from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { APP_NAME } from "~/config/constants";
import CreateOrder from "~/components/account/orders/CreateOrder";

const NewOrderPage = () => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") void router.replace("/");
  }, [router, status]);

  return (
    <>
      <Head>
        <title>{`Create new order | ${APP_NAME}`}</title>
      </Head>
      <CreateOrder />
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

import Layout from "~/components/layout/Layout";
NewOrderPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default NewOrderPage;
