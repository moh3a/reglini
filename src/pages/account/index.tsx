import { type ReactElement } from "react";
import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";

import { APP_NAME } from "~/config/constants";
import AccountDetails from "~/components/account/AccountDetails";

const AccountPage = () => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      void router.replace("/");
    },
  });

  return (
    <>
      <Head>
        <title>
          {session?.user?.name
            ? `${session.user.name}'s account settings | `
            : `Account | ` + APP_NAME}
        </title>
      </Head>
      {session && <AccountDetails />}
    </>
  );
};

import Layout from "~/components/layout/Layout";
import pick from "lodash/pick";
AccountPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

AccountPage.messages = ["AccountPage.details", Layout.messages].flat();

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        await import(`../../../messages/${locale}.json`),
        AccountPage.messages,
      ),
    },
  };
};

export default AccountPage;
