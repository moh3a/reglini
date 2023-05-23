/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import Button from "@components/shared/Button";

const CurrencyHero = () => {
  const t = useTranslations("IndexPage.currencyHero");
  return (
    <div className="h-screen py-24 md:py-36 mx-auto max-w-6xl flex items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
      >
        <div>
          <div
            className={`relative px-6 flex flex-col md:flex-row justify-between`}
          >
            <div
              className={`z-0 relative flex justify-center items-center md:basis-1/4`}
            >
              <div className="absolute ltr:rotate-[5deg] rtl:-rotate-[5deg] bg-gradient-to-br blur-3xl rounded-3xl from-sky-500 to-cyan-300 ltr:-left-5 ltr:md:-left-10 ltr:lg:-left-20 rtl:right-0 top-36 md:-top-10 h-[250px] md:h-[520px] w-[100px] md:w-[250px]" />
              <div className="absolute ltr:rotate-[5deg] rtl:-rotate-[5deg] ltr:hover:rotate-[6deg] rtl:hover:-rotate-[6deg] transition-transform duration-200 ease-in ltr:-left-6 ltr:md:-left-10 ltr:lg:-left-20 rtl:right-0 top-32 md:-top-5 w-[100px] md:w-[220px]">
                <img
                  className="w-full"
                  src="/screenshots/reglini-android.png"
                  alt="reglini ui screenshot"
                  height={2000}
                />
              </div>
            </div>
            <div className="z-20 md:basis-3/4 ltr:text-right rtl:text-left">
              <h2 className="font-mono">{t("subtitle")}</h2>
              <h1 className="text-3xl sm:text-5xl font-bold z-50">
                {t("title")}
              </h1>
            </div>
          </div>
          <div className="p-6 flex justify-end">
            <Link href={"/currency"}>
              <Button variant="solid">{t("button")}</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CurrencyHero;
