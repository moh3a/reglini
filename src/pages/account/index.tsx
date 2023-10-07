import { useEffect, type ReactElement } from "react";
import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";

import { APP_NAME } from "~/config/constants";
import AccountDetails from "~/components/account/AccountDetails";

const AccountPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") void router.replace("/");
  }, [router, status]);

  return (
    <>
      <Head>
        <title>
          {session && session.user?.name
            ? `${session.user.name}'s account settings | `
            : `Account | ` + APP_NAME}
        </title>
      </Head>
      {session && <AccountDetails />}
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
};

import Layout from "~/components/layout/Layout";
AccountPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AccountPage;
