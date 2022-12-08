import { GetServerSideProps } from "next";
import { getCsrfToken, getProviders, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { APP_NAME } from "@config/general";
import LoginProviders from "@components/auth/LoginProviders";
import Register from "@components/auth/Register";
import Title from "@components/shared/Title";

interface AuthProps {
  csrfToken: any;
  providers: any;
}

const RegisterPage = ({ csrfToken, providers }: AuthProps) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "unauthenticated") router.replace("/");
  }, [router, status]);

  return (
    <>
      <Head>
        <title>{"Register | " + APP_NAME}</title>
      </Head>
      {status !== "authenticated" && (
        <section className="mx-auto max-w-lg">
          <Title title="Register a new account" />
          <Register csrfToken={csrfToken} />
          <div className="flex items-center justify-between my-4">
            <span className="w-1/5 border-b border-darkTransparent lg:w-1/5"></span>
            <div className="text-xs text-center select-none uppercase">
              or sign up with Social Media
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
  const messages = (
    await import(`../../../locales/${context.locale}/AuthPage.json`)
  ).default;
  return {
    props: { csrfToken, providers, messages },
  };
};

import Layout from "@components/layout/Layout";
RegisterPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default RegisterPage;
