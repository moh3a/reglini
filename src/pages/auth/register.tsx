import { useEffect, type ReactElement } from "react";
import type { GetServerSideProps } from "next";
import { getCsrfToken, getProviders, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { APP_NAME } from "~/config/constants";
import LoginProviders from "~/components/auth/LoginProviders";
import Register from "~/components/auth/Register";
import { Title } from "~/components/shared";
import type { AuthProps } from "~/types";

const RegisterPage = ({ csrfToken, providers }: AuthProps) => {
  const { status } = useSession();
  const router = useRouter();
  const t = useTranslations("AuthPage.register");

  useEffect(() => {
    if (status === "authenticated") void router.replace("/");
  }, [router, status]);

  return (
    <>
      <Head>
        <title>{`${t("title")} ${APP_NAME}`}</title>
      </Head>
      {status !== "authenticated" && (
        <section className="mx-auto max-w-lg px-6">
          <Title center={true} title={t("title")} />
          <Register csrfToken={csrfToken} />
          <div className="my-4 flex items-center justify-between">
            <span className="w-1/5 border-b border-darkTransparent lg:w-1/5"></span>
            <div className="select-none text-center text-xs uppercase">
              {t("socialMedia")}
            </div>
            <span className="w-1/5 border-b border-darkTransparent lg:w-1/5"></span>
          </div>
          <LoginProviders providers={providers} />
        </section>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();
  return {
    props: {
      csrfToken,
      providers,
      messages: (await import(`../../../messages/${context.locale}.json`))
        .default,
    },
  };
};

import Layout from "~/components/layout/Layout";
RegisterPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default RegisterPage;
