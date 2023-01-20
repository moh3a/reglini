/* eslint-disable @next/next/no-img-element */
import { Fragment } from "react";
import { Currency } from "@prisma/client";
import { BG_TRANSPARENT_BACKDROP, SHADOW } from "@config/design";
import { useTranslations } from "next-intl";

const CurrencyCard = ({
  currency,
  market,
}: {
  currency: Currency;
  market: "parallel_purchase" | "parallel_sale" | "official_rate";
}) => {
  const t = useTranslations("CurrencyPage.liveRate");
  return (
    <Fragment key={currency.id}>
      <div
        className={`flex-1 ${SHADOW} rounded-2xl p-2 md:p-4 mx-1 md:mx-2 my-4 ${BG_TRANSPARENT_BACKDROP}`}
      >
        <div className="flex items-center">
          {currency.exchange === "EUR" && (
            <>
              <FlagEU />
              <p className="text-md ltr:ml-2 rtl:mr-2">1 € =</p>
            </>
          )}
          {currency.exchange === "USD" && (
            <>
              <FlagUS />
              <p className="text-md ltr:ml-2 rtl:mr-2">1 $ =</p>
            </>
          )}
          {currency.exchange === "GBP" && (
            <>
              <FlagUK />
              <p className="text-md ltr:ml-2 rtl:mr-2">1 £ =</p>
            </>
          )}
        </div>
        <small className="text-xs">
          {t("updated")} : {currency.date.toISOString().substring(2, 10)}
        </small>
        <div className="flex flex-col justify-start">
          <p className="text-gray-700 dark:text-gray-100 text-2xl md:text-4xl font-bold my-3 md:my-4">
            {currency[market]}
            <span className="text-sm">DZD</span>
          </p>
        </div>
      </div>
    </Fragment>
  );
};

const FlagEU = () => {
  return (
    <div className="w-6 h-6 inline rounded-full">
      <img src="/flag-eu.png" alt="EU flag" />
    </div>
  );
};

const FlagUK = () => {
  return (
    <div className="w-6 h-6 inline">
      <a
        className="sr-only"
        href="https://icons8.com/icon/t3NE3BsOAQwq/great-britain"
      >
        Great Britain icon by Icons8
      </a>
      <img
        src="https://img.icons8.com/color/48/000000/great-britain-circular.png"
        alt="UK flag"
      />
    </div>
  );
};

const FlagUS = () => {
  return (
    <div className="w-6 h-6 inline">
      <a className="sr-only" href="https://icons8.com/icon/aRiu1GGi6Aoe/usa">
        Usa icon by Icons8
      </a>
      <img
        src="https://img.icons8.com/color/48/000000/usa-circular.png"
        alt="USA flag"
      />
    </div>
  );
};

export default CurrencyCard;
