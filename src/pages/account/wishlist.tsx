import { useEffect } from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";

import { APP_NAME } from "@config/general";
import Wishlist from "@components/account/Wishlist";

const WishlistPage = () => {
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
            ? `${session.user.name}'s wishlist | `
            : `Wishlist | ` + APP_NAME}
        </title>
      </Head>
      {session && <Wishlist />}
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

import Layout from "@components/layout/Layout";
WishlistPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default WishlistPage;
