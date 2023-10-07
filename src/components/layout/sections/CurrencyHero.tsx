/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Button } from "~/components/shared";

export const CurrencyHero = () => {
  const t = useTranslations("IndexPage.currencyHero");
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
            <div
              className={`relative z-0 flex items-center justify-center md:basis-1/4`}
            >
              <div className="absolute top-36 h-[250px] w-[100px] rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-300 blur-3xl ltr:-left-5 ltr:rotate-[5deg] rtl:right-0 rtl:-rotate-[5deg] md:-top-10 md:h-[520px] md:w-[250px] ltr:md:-left-10 ltr:lg:-left-20" />
              <div className="absolute top-32 w-[100px] transition-transform duration-200 ease-in ltr:-left-6 ltr:rotate-[5deg] ltr:hover:rotate-[6deg] rtl:right-0 rtl:-rotate-[5deg] rtl:hover:-rotate-[6deg] md:-top-5 md:w-[220px] ltr:md:-left-10 ltr:lg:-left-20">
                <img
                  className="w-full"
                  src="/screenshots/reglini-android.png"
                  alt="reglini ui screenshot"
                  height={2000}
                />
              </div>
            </div>
            <div className="z-20 ltr:text-right rtl:text-left md:basis-3/4">
              <h2 className="font-mono">{t("subtitle")}</h2>
              <h1 className="z-50 text-3xl font-bold sm:text-5xl">
                {t("title")}
              </h1>
            </div>
          </div>
          <div className="flex justify-end p-6">
            <Link href={"/currency"}>
              <Button variant="solid">{t("button")}</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
