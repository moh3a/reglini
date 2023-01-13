import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";

import { APP_NAME } from "@config/general";
import AccountVerification from "@components/account/AccountVerification";

const AccountVerificationPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const { token } = router.query;

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/");
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
AccountVerificationPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
export default AccountVerificationPage;
