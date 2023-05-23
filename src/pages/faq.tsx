import { ReactNode, useState } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { PADDING, ROUNDED, SHADOW } from "@config/design";
import { APP_NAME } from "@config/general";
import Title from "@components/shared/Title";

const Item = ({ title, children }: { title: string; children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={` ${SHADOW} ${PADDING} ${ROUNDED}`}>
      <button
        type="button"
        aria-label="Open item"
        title="Open item"
        className="flex items-center justify-between w-full p-4 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-lg font-bold">{title}</p>
        <div className="flex items-center justify-center w-8 h-8 border rounded-full">
          <svg
            viewBox="0 0 24 24"
            className={`w-3 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          >
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeMiterlimit="10"
              points="2,7 12,17 22,7"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="p-4 pt-0">
          <div>{children}</div>
        </div>
      )}
    </div>
  );
};

const FAQPage = () => {
  const t = useTranslations("FAQPage");
  return (
    <>
      <Head>
        <title>{`FAQ | ${APP_NAME}`}</title>
      </Head>
      <div className="mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="max-w-xl sm:mx-auto lg:max-w-2xl">
          <div className="flex flex-col mb-16 sm:text-center">
            <div className="max-w-xl md:mx-auto sm:text-center lg:max-w-2xl">
              <Title center={true} title="F.A.Q." />
            </div>
          </div>
          <div className="px-4 my-4 space-y-4">
            <Item title={t("f1.question")}>{t("f1.answer")}</Item>
            <Item title={t("f2.question")}>{t("f2.answer")}</Item>
            <Item title={t("f3.question")}>
              <ul className="list-disc">
                <li>{t("f3.item1")}</li>
                <li>{t("f3.item2")}</li>
                <li>{t("f3.item3")}</li>
                <li>{t("f3.item4")}</li>
                <li>{t("f3.item5")}</li>
                <li>{t("f3.item6")}</li>
              </ul>
            </Item>
            <Item title={t("f4.question")}>
              <div dangerouslySetInnerHTML={{ __html: t.raw("f4.answer") }} />
            </Item>
            <Item title={t("f5.question")}>
              <div dangerouslySetInnerHTML={{ __html: t.raw("f5.answer") }} />
            </Item>
            <Item title={t("f6.question")}>
              <div dangerouslySetInnerHTML={{ __html: t.raw("f6.answer") }} />
            </Item>
            <Item title={t("f7.question")}>{t("f7.answer")}</Item>
            <div className="text-base text-center md:text-lg">
              {t("directToSupport.haveAnyQuestion")}{" "}
              <Link href="/support" passHref>
                <p className="cursor-pointer text-gray-500 dark:text-gray-400">
                  {t("directToSupport.goHere")}
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
};

import Layout from "@components/layout/Layout";
FAQPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default FAQPage;
