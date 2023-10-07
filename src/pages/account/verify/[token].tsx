import { useEffect, type ReactElement } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";

import { APP_NAME } from "~/config/constants";
import AccountVerification from "~/components/account/AccountVerification";

const AccountVerificationPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const { token } = router.query;

  useEffect(() => {
    if (status === "unauthenticated") void router.replace("/");
  }, [router, status]);

  return (
    <>
      <Head>
        <title>{`Account Verification | ${APP_NAME}`}</title>
      </Head>
      {token && <AccountVerification token={token as string} />}
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
AccountVerificationPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default AccountVerificationPage;
