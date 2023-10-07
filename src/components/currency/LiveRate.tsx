import { useTranslations } from "next-intl";

import { TEXT_GRADIENT } from "~/config/design";
import { Loading } from "~/components/shared";
import CurrencyCard from "~/components/currency/CurrencyCard";
import { api } from "~/utils/api";

const LiveRate = () => {
  const currencies = api.currency.currencies.useQuery();
  const t = useTranslations("CurrencyPage.liveRate");

  return (
    <div>
      {currencies.isLoading && (
        <div className="flex w-full items-center justify-center">
          <Loading size="large" />
        </div>
      )}
      {currencies?.data?.currencies && (
        <>
          <div className="flex flex-col items-center px-2 py-8 lg:py-16">
            <h1 className="text-center text-xl font-bold lg:text-4xl">
              {t.rich("intro", {
                market: t("parallel"),
                highlight: (chunks) => (
                  <span className={TEXT_GRADIENT}>{chunks}</span>
                ),
              })}
            </h1>
            <div className="text-center text-xs lg:text-sm">
              {t("desc", { market: t("parallel") })}
            </div>
            <h2 className="font-mono text-lg font-semibold underline lg:text-xl">
              {t("purchase")}
            </h2>
            <div className="flex select-none justify-around">
              {currencies.data.currencies.map(
                (currency) =>
                  currency && (
                    <CurrencyCard
                      key={currency.id}
                      currency={currency}
                      market="parallel_purchase"
                    />
                  ),
              )}
            </div>
            <h2 className="font-mono text-lg font-semibold underline lg:text-xl">
              {t("sale")}
            </h2>
            <div className="flex-center flex select-none flex-wrap">
              {currencies.data.currencies.map(
                (currency) =>
                  currency && (
                    <CurrencyCard
                      key={currency.id}
                      currency={currency}
                      market="parallel_sale"
                    />
                  ),
              )}
            </div>
          </div>
          <div className="flex flex-col items-center px-2 py-8 lg:py-16">
            <h1 className="text-center text-xl font-bold lg:text-4xl">
              {t.rich("intro", {
                market: t("official"),
                highlight: (chunks) => (
                  <span className={TEXT_GRADIENT}>{chunks}</span>
                ),
              })}
            </h1>
            <div className="text-center text-xs lg:text-sm">
              {t("desc", { market: t("official") })}
            </div>
            <div className="flex-center flex select-none flex-wrap">
              {currencies.data.currencies.map(
                (currency) =>
                  currency && (
                    <CurrencyCard
                      key={currency.id}
                      currency={currency}
                      market="official_rate"
                    />
                  ),
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveRate;
