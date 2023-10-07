import { type ReactElement } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";

import { APP_NAME } from "~/config/constants";
import AccountVerification from "~/components/account/AccountVerification";

const AccountVerificationPage = () => {
  const router = useRouter();
  const { token } = router.query;
  useSession({
    required: true,
    onUnauthenticated() {
      void router.replace("/");
    },
  });

  return (
    <>
      <Head>
        <title>{`Account Verification | ${APP_NAME}`}</title>
      </Head>
      {token && <AccountVerification token={token.toString()} />}
    </>
  );
};

import Layout from "~/components/layout/Layout";
import pick from "lodash/pick";
AccountVerificationPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

AccountVerificationPage.messages = Layout.messages;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        await import(`../../../../messages/${locale}.json`),
        AccountVerificationPage.messages,
      ),
    },
  };
};

export default AccountVerificationPage;
