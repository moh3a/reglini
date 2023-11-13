import { type ReactNode, useState } from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { PADDING, ROUNDED, SHADOW } from "~/config/design";
import { APP_NAME } from "~/config/constants";
import { Title } from "~/components/shared";

const Item = ({ title, children }: { title: string; children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={` ${SHADOW} ${PADDING} ${ROUNDED}`}>
      <button
        type="button"
        aria-label="Open item"
        title="Open item"
        className="flex w-full items-center justify-between p-4 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-lg font-bold">{title}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border">
          <svg
            viewBox="0 0 24 24"
            className={`w-3 transition-transform duration-200 ${
              isOpen ? "rotate-180 transform" : ""
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
      <div className="mx-auto sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl lg:px-8">
        <div className="max-w-xl sm:mx-auto lg:max-w-2xl">
          <div className="mb-16 flex flex-col sm:text-center">
            <div className="max-w-xl sm:text-center md:mx-auto lg:max-w-2xl">
              <Title center={true} title="F.A.Q." />
            </div>
          </div>
          <div className="my-4 space-y-4 px-4">
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
              <div
                dangerouslySetInnerHTML={{
                  __html: t.raw("f4.answer") as string,
                }}
              />
            </Item>
            <Item title={t("f5.question")}>
              <div
                dangerouslySetInnerHTML={{
                  __html: t.raw("f5.answer") as string,
                }}
              />
            </Item>
            <Item title={t("f6.question")}>
              <div
                dangerouslySetInnerHTML={{
                  __html: t.raw("f6.answer") as string,
                }}
              />
            </Item>
            <Item title={t("f7.question")}>{t("f7.answer")}</Item>
            <div className="text-center text-base md:text-lg">
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

import pick from "lodash/pick";
import Layout from "~/components/layout/Layout";

FAQPage.messages = ["FAQPage", Layout.messages].flat();

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: pick(
        await import(`../../messages/${locale}.json`),
        FAQPage.messages,
      ),
    },
  };
};

export default FAQPage;
