/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import Button from "@components/shared/Button";

const AliexpressHero = () => {
  const t = useTranslations("IndexPage");
  const [serviceIdx, setServiceIdx] = useState(3);

  useEffect(() => {
    setTimeout(() => {
      setServiceIdx(serviceIdx === 3 ? 0 : serviceIdx + 1);
    }, 3000);
  }, [serviceIdx]);

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
            <div className="z-20 md:basis-3/4">
              <h2 className="font-mono">{t("wantToShop")}</h2>
              <h1 className="text-4xl sm:text-6xl font-bold z-50">
                {t("start")}
              </h1>
            </div>

            <div
              className={`z-0 relative flex justify-center items-center md:basis-1/4`}
            >
              <div className="absolute ltr:-rotate-[5deg] rtl:rotate-[5deg] bg-gradient-to-tl blur-3xl rounded-3xl from-aliexpress to-amber-300 dark:to-amber-900 ltr:left-64 ltr:md:-left-14 ltr:lg:-left-5 ltr:xl:left-5 top-3 md:-top-6 w-[420px] md:w-[800px] h-[300px] md:h-[500px]" />
              <div className="absolute ltr:-rotate-[5deg] rtl:rotate-[5deg] ltr:hover:-rotate-[4deg] rtl:hover:rotate-[4deg] transition-transform duration-200 ease-in ltr:left-72 ltr:md:-left-14 ltr:lg:-left-5 ltr:xl:left-5 top-5 md:-top-5 w-[400px] md:w-[750px]">
                <img
                  className="w-full"
                  src="/screenshots/reglini-laptop.png"
                  alt="reglini ui screenshot"
                  width={2000}
                />
              </div>
            </div>
          </div>
          <div className="z-50 px-6 h-12 my-6 text-lg font-bold">
            {t.rich("services.component", {
              highlight: (chunks) => (
                <span
                  className={`bg-clip-text text-transparent bg-gradient-to-r 
                ${serviceIdx === 0 && "from-amber-500 to-teal-500"}
                ${serviceIdx === 1 && "from-amber-500 to-indigo-500"}
                ${serviceIdx === 2 && "from-amber-500 to-sky-500"}
                ${serviceIdx === 3 && "from-amber-500 to-aliexpress"}
                `}
                >
                  {chunks}
                </span>
              ),
              service: t(`services.${serviceIdx}` as any),
            })}
          </div>
          <div className="p-6">
            <Link href={"/aliexpress"}>
              <Button variant="solid">{t("button")}</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AliexpressHero;
