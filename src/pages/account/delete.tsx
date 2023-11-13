import type { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { APP_NAME } from "~/config/constants";
import DeleteAccount from "~/components/account/DeleteAccount";

const DeleteAccountPage = () => {
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
            ? `Delete ${session.user.name} | `
            : `Delete account | ` + APP_NAME}
        </title>
      </Head>
      {session && <DeleteAccount />}
    </>
  );
};

import Layout from "~/components/layout/Layout";
import pick from "lodash/pick";

DeleteAccountPage.messages = ["AccountPage.delete", Layout.messages].flat();

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        await import(`../../../messages/${locale}.json`),
        DeleteAccountPage.messages,
      ),
    },
  };
};

export default DeleteAccountPage;
