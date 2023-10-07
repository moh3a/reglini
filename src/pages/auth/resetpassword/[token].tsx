import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useTranslations } from "next-intl";

import { TEXT_GRADIENT } from "~/config/design";
import { APP_NAME } from "~/config/constants";
import ResetPassword from "~/components/auth/ResetPassword";

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const t = useTranslations("AuthPage.resetYourPassword");

  return (
    <>
      <Head>
        <title>{`${t("title")} | ${APP_NAME}`}</title>
      </Head>
      {token ? (
        <ResetPassword token={token.toString()} />
      ) : (
        <div className="mt-28 flex-col text-center">
          <div className="select-none text-6xl font-extrabold">
            <span className={TEXT_GRADIENT}>No Token</span> 😵
          </div>
        </div>
      )}
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
import type { ReactElement } from "react";
ResetPasswordPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ResetPasswordPage;
