import { type ReactElement } from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { APP_NAME } from "~/config/constants";
import CreateOrder from "~/components/account/orders/CreateOrder";

const NewOrderPage = () => {
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
        <title>{`Create new order | ${APP_NAME}`}</title>
      </Head>
      <CreateOrder />
    </>
  );
};

import Layout from "~/components/layout/Layout";
import pick from "lodash/pick";
NewOrderPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

NewOrderPage.messages = [
  "AccountPage.orders",
  "AccountPage.details",
  "AccountPage.price",
  Layout.messages,
].flat();

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        await import(`../../../../messages/${locale}.json`),
        NewOrderPage.messages,
      ),
    },
  };
};

export default NewOrderPage;
