import { useEffect } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { APP_NAME } from "@config/general";
import DeleteAccount from "@components/account/DeleteAccount";

const DeleteAccountPage = () => {
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
            ? `Delete ${session.user.name} | `
            : `Delete account | ` + APP_NAME}
        </title>
      </Head>
      {session && <DeleteAccount />}
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const messages = (await import(`../../../locales/${locale}/AuthPage.json`))
    .default;
  return {
    props: {
      messages,
    },
  };
};

import Layout from "../../components/layout/Layout";
DeleteAccountPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default DeleteAccountPage;
