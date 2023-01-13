import { useEffect } from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";

import { APP_NAME } from "@config/general";
import AccountDetails from "@components/account/AccountDetails";

const AccountPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/");
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

import { pick } from "lodash";
const namespaces = ["Common"];
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        (await import(`../../../messages/${locale}.json`)).default,
        namespaces
      ),
    },
  };
};

import Layout from "@components/layout/Layout";
AccountPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default AccountPage;
