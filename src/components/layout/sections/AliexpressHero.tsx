/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

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
      <div>
        <div className={`relative px-6 sm:flex sm:flex-row sm:justify-between`}>
          <div className="z-20 basis-5/6 md:basis-3/4">
            <h2 className="font-mono">{t("wantToShop")}</h2>
            <h1 className="text-6xl font-bold z-50">{t("start")}</h1>
          </div>

          <div
            className={`z-0 hidden sm:relative sm:flex justify-center items-center basis-1/6 md:basis-1/4`}
          >
            <div className="absolute ltr:-rotate-[5deg] rtl:rotate-[5deg] bg-gradient-to-tl blur-3xl rounded-3xl from-aliexpress to-amber-300 dark:to-amber-900 ltr:sm:-left-14 ltr:lg:-left-5 ltr:xl:left-5 -top-6 w-[800px] h-[500px]" />
            <div className="absolute ltr:-rotate-[5deg] rtl:rotate-[5deg] ltr:hover:-rotate-[4deg] rtl:hover:rotate-[4deg] transition-transform duration-200 ease-in ltr:sm:-left-14 ltr:lg:-left-5 ltr:xl:left-5 -top-5 w-[750px]">
              <img
                className="w-full"
                src="/screenshots/reglini-laptop.png"
                alt="reglini ui screenshot"
                width={2000}
              />
            </div>
          </div>
        </div>
        <div className="px-6 h-12 my-6 text-lg font-bold">
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
    </div>
  );
};

export default AliexpressHero;
