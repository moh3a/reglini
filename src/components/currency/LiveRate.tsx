import Loading from "@components/shared/Loading";
import { TEXT_GRADIENT } from "@config/design";
import { trpc } from "@utils/trpc";
import { useTranslations } from "next-intl";
import CurrencyCard from "./CurrencyCard";

const LiveRate = () => {
  const currencies = trpc.currency.currencies.useQuery();
  const t = useTranslations("CurrencyPage.liveRate");

  return (
    <div>
      {currencies.isLoading && (
        <div className="w-full flex justify-center items-center">
          <Loading size="large" />
        </div>
      )}
      {currencies.data && currencies.data.currencies && (
        <>
          <div className="py-8 lg:py-16 px-4 flex flex-col items-center">
            <h1 className="text-center text-xl lg:text-4xl font-bold">
              {t.rich("intro", {
                market: t("parallel"),
                highlight: (chunks) => (
                  <span className={TEXT_GRADIENT}>{chunks}</span>
                ),
              })}
            </h1>
            <div className="text-xs lg:text-sm">
              {t("desc", { market: t("parallel") })}
            </div>
            <h2 className="text-lg lg:text-xl font-semibold underline font-mono">
              {t("purchase")}
            </h2>
            <div className="flex flex-wrap flex-center select-none">
              {currencies.data.currencies.map((currency) => (
                <CurrencyCard
                  key={currency.id}
                  currency={currency}
                  market="parallel_purchase"
                />
              ))}
            </div>
            <h2 className="text-lg lg:text-xl font-semibold underline font-mono">
              {t("sale")}
            </h2>
            <div className="flex flex-wrap flex-center select-none">
              {currencies.data.currencies.map((currency) => (
                <CurrencyCard
                  key={currency.id}
                  currency={currency}
                  market="parallel_sale"
                />
              ))}
            </div>
          </div>
          <div className="py-8 lg:py-16 px-4 flex flex-col items-center">
            <h1 className="text-center text-xl lg:text-4xl font-bold">
              {t.rich("intro", {
                market: t("official"),
                highlight: (chunks) => (
                  <span className={TEXT_GRADIENT}>{chunks}</span>
                ),
              })}
            </h1>
            <div className="text-xs lg:text-sm">
              {t("desc", { market: t("official") })}
            </div>
            <div className="grid grid-cols-3 gap-x-3 md:gap-x-6 select-none">
              {currencies.data.currencies.map((currency) => (
                <CurrencyCard
                  key={currency.id}
                  currency={currency}
                  market="official_rate"
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveRate;
