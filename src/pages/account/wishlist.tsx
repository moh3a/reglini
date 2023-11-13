import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import Wishlist from "~/components/account/Wishlist";

const WishlistPage = () => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      void router.replace("/");
    },
  });

  return <>{session && <Wishlist />}</>;
};

import pick from "lodash/pick";
import Layout from "~/components/layout/Layout";

WishlistPage.messages = ["AccountPage", Layout.messages].flat();

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        await import(`../../../messages/${locale}.json`),
        WishlistPage.messages,
      ),
    },
  };
};

export default WishlistPage;
