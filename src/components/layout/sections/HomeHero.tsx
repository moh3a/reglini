/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import Button from "@components/shared/Button";
import { useRouter } from "next/router";

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
      <div className="relative px-6 lg:flex lg:justify-between">
        <div className="z-50">
          <h2 className="font-mono">{t("wantToShop")}</h2>
          <h1 className="text-6xl font-bold z-50">{t("start")}</h1>
        </div>
        <div
          className={`absolute z-0 ${
            router.locale === "ar" ? "left-10 -bottom-10" : "right-10 bottom-0"
          }`}
        >
          <img
            className="-rotate-[50deg] z-0"
            src="/aliexpress-icon.png"
            alt="aliexpress icon"
            width={100}
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
