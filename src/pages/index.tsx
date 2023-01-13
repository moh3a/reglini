import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import Title from "@components/shared/Title";

const IndexPage = () => {
  const t = useTranslations("IndexPage");
  const { data: session } = useSession();

  return (
    <>
      <Title
        title={`${t("hello", {
          user: session && session.user ? session.user.name : "guest",
        })}`}
      />
    </>
  );
};

import { pick } from "lodash";
const namespaces = ["IndexPage", "Common"];
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        (await import(`../../messages/${locale}.json`)).default,
        namespaces
      ),
    },
  };
};

import Layout from "@components/layout/Layout";
IndexPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default IndexPage;
