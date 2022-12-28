/* eslint-disable @next/next/no-img-element */
import { Fragment } from "react";
import { Currency } from "@prisma/client";
import { BG_TRANSPARENT_BACKDROP, SHADOW } from "@config/design";

const CurrencyCard = ({
  currency,
  market,
}: {
  currency: Currency;
  market: "parallel_purchase" | "parallel_sale" | "official_rate";
}) => {
  return (
    <Fragment key={currency.id}>
      <div
        className={` ${SHADOW} rounded-2xl p-4 mx-2 my-4 ${BG_TRANSPARENT_BACKDROP}`}
      >
        <div className="flex items-center">
          {currency.exchange === "EUR" && (
            <>
              <FlagEU />
              <p className="text-md ml-2">1 € =</p>
            </>
          )}
          {currency.exchange === "USD" && (
            <>
              <FlagUS />
              <p className="text-md ml-2">1 $ =</p>
            </>
          )}
          {currency.exchange === "GBP" && (
            <>
              <FlagUK />
              <p className="text-md ml-2">1 £ =</p>
            </>
          )}
        </div>
        <small className="text-xs">
          Updated: {currency.date.toISOString().substring(0, 10)}
        </small>
        <div className="flex flex-col justify-start">
          <p className="text-gray-700 dark:text-gray-100 text-4xl text-left font-bold my-4">
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
