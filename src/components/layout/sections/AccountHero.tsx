/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Button } from "~/components/shared";

export const AccountHero = () => {
  const t = useTranslations("IndexPage.accountHero");
  const { status } = useSession();
  return (
    <div className="mx-auto flex h-screen max-w-6xl items-center py-24 md:py-36">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
      >
        <div>
          <div
            className={`relative flex flex-col justify-between px-6 md:flex-row`}
          >
            <div className="z-20 md:basis-3/4">
              <h2 className="font-mono">{t("subtitle")}</h2>
              <h1 className="z-50 text-3xl font-bold sm:text-5xl">
                {t("title")}
              </h1>
            </div>
            <div
              className={`relative z-0 flex items-center justify-center md:basis-1/4`}
            >
              <div className="absolute -top-6 h-[220px] w-[160px] rounded-3xl bg-gradient-to-t from-teal-600 to-indigo-600 blur-3xl ltr:left-64 ltr:-rotate-[5deg] rtl:left-0 rtl:rotate-[5deg] md:h-[400px] md:w-[300px] ltr:md:-left-14 rtl:md:right-14 ltr:lg:-left-5 rtl:lg:right-32 ltr:xl:left-5 rtl:xl:right-40 " />
              <div className="absolute -top-5 w-[150px] transition-transform duration-200 ease-in ltr:left-72 ltr:-rotate-[5deg] ltr:hover:-rotate-[4deg] rtl:left-0 rtl:rotate-[5deg] rtl:hover:rotate-[4deg] md:w-[300px] ltr:md:-left-14 rtl:md:right-14 ltr:lg:-left-5 rtl:lg:right-32 ltr:xl:left-5 rtl:xl:right-40">
                <img
                  className="w-full"
                  src="/screenshots/reglini-tablet.png"
                  alt="reglini ui screenshot"
                  width={2000}
                />
              </div>
            </div>
          </div>
          <div className="p-6">
            <Link
              href={status === "authenticated" ? "/account" : "/auth/login"}
            >
              <Button variant="solid">{t("button")}</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
