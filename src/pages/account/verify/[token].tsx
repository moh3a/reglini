import { useEffect } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";

import { useMessage } from "~/utils/store";
import { api } from "~/utils/api";
import { APP_NAME } from "~/config/constants";

const AccountVerificationPage = () => {
  const router = useRouter();
  const { setMessage } = useMessage();
  useSession({
    required: true,
    onUnauthenticated() {
      void router.replace("/");
    },
  });
  const { token } = router.query;
  const verificationQuery = api.account.verification.useQuery({
    token: token?.toString() ?? "",
  });

  useEffect(() => {
    if (verificationQuery.isLoading) {
      setMessage({ type: "warning", text: "Loading..." });
    } else if (verificationQuery.isError) {
      setMessage({ type: "error", text: verificationQuery.error.message });
    } else if (verificationQuery.data) {
      if (verificationQuery.data.success) {
        setMessage({
          type: "success",
          text: verificationQuery.data.message ?? "",
        });
        void router.push("/account");
      } else {
        setMessage({
          type: "error",
          text: verificationQuery.data.message ?? "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, verificationQuery]);

  return (
    <Head>
      <title>{`Account Verification | ${APP_NAME}`}</title>
    </Head>
  );
};

import Layout from "~/components/layout/Layout";
import pick from "lodash/pick";

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
