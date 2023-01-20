/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import Button from "@components/shared/Button";

const HomeHero = () => {
  const t = useTranslations("IndexPage");
  const router = useRouter();
  const [serviceIdx, setServiceIdx] = useState(3);

  useEffect(() => {
    setTimeout(() => {
      setServiceIdx(serviceIdx === 3 ? 0 : serviceIdx + 1);
    }, 3000);
  }, [serviceIdx]);

  return (
    <div className="my-24 mx-auto max-w-6xl">
      <div className={`relative px-6 sm:flex sm:flex-row sm:justify-between`}>
        <div className="z-20 basis-5/6 md:basis-3/4">
          <h2 className="font-mono">{t("wantToShop")}</h2>
          <h1 className="text-6xl font-bold z-50">{t("start")}</h1>
        </div>

        <div
          className={`z-0 hidden sm:flex justify-center items-center basis-1/6 md:basis-1/4`}
        >
          <img
            className="ltr:-rotate-[50deg] rtl:rotate-[50deg] z-0 sm:w-20 lg:w-28"
            src="/aliexpress-icon.png"
            alt="aliexpress icon"
          />
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
      <div className="px-6">
        <Link href={"/aliexpress"}>
          <Button variant="solid">{t("button")}</Button>
        </Link>
      </div>
    </div>
  );
};

export default HomeHero;
