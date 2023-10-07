/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import { Button } from "~/components/shared";

export const AliexpressHero = () => {
  const t = useTranslations("IndexPage.aliexpressHero");
  const [serviceIdx, setServiceIdx] = useState(3);

  useEffect(() => {
    setTimeout(() => {
      setServiceIdx(serviceIdx === 3 ? 0 : serviceIdx + 1);
    }, 3000);
  }, [serviceIdx]);

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
              <h2 className="font-mono">{t("wantToShop")}</h2>
              <h1 className="z-50 text-4xl font-bold sm:text-6xl">
                {t("start")}
              </h1>
            </div>

            <div
              className={`relative z-0 flex items-center justify-center md:basis-1/4`}
            >
              <div className="absolute top-4 h-[280px] w-[400px] rounded-3xl from-aliexpress to-amber-500 blur-3xl ltr:left-64 ltr:-rotate-[5deg] ltr:bg-gradient-to-tl rtl:-left-44 rtl:rotate-[5deg] rtl:bg-gradient-to-tr md:-top-6 md:h-[450px] md:w-[750px] ltr:md:-left-14 rtl:md:right-0 ltr:lg:-left-5 ltr:xl:left-5" />
              <div className="absolute top-5 w-[400px] transition-transform duration-200 ease-in ltr:left-72 ltr:-rotate-[5deg] ltr:hover:-rotate-[4deg] rtl:-left-64 rtl:rotate-[5deg] rtl:hover:rotate-[4deg] md:-top-5 md:w-[750px] ltr:md:-left-14 rtl:md:right-0 ltr:lg:-left-5 ltr:xl:left-5">
                <img
                  className="w-full"
                  src="/screenshots/reglini-laptop.png"
                  alt="reglini ui screenshot"
                  width={2000}
                />
              </div>
            </div>
          </div>
          <div className="z-50 my-6 h-12 px-6 text-lg font-bold">
            {t.rich("services.component", {
              highlight: (chunks) => (
                <span
                  className={`bg-gradient-to-r bg-clip-text text-transparent 
                ${serviceIdx === 0 && "from-amber-500 to-teal-500"}
                ${serviceIdx === 1 && "from-amber-500 to-indigo-500"}
                ${serviceIdx === 2 && "from-amber-500 to-sky-500"}
                ${serviceIdx === 3 && "from-amber-500 to-aliexpress"}
                `}
                >
                  {chunks}
                </span>
              ),
              service: t(`services.${serviceIdx as 0 | 1 | 2 | 3}`),
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
