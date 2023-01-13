import { useEffect } from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import Wishlist from "@components/account/Wishlist";

const WishlistPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/");
  }, [router, status]);

  return <>{session && <Wishlist />}</>;
};

import { pick } from "lodash";
const namespaces = ["Common"];
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        (await import(`../../../messages/${locale}.json`)).default,
        namespaces
      ),
    },
  };
};

import Layout from "@components/layout/Layout";
WishlistPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default WishlistPage;
