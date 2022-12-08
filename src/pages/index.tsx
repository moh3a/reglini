import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";

import Title from "@components/shared/Title";

const IndexPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Title
        title={`hello ${session && session.user ? session.user.name : "guest"}`}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const messages = (await import(`../../locales/${locale}/IndexPage.json`))
    .default;
  return {
    props: {
      messages,
    },
  };
};

import Layout from "@components/layout/Layout";
IndexPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default IndexPage;
