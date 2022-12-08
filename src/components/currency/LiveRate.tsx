import Loading from "@components/shared/Loading";
import { TEXT_GRADIENT } from "@config/design";
import { trpc } from "@utils/trpc";
import CurrencyCard from "./CurrencyCard";

const LiveRate = () => {
  const currencies = trpc.currency.currencies.useQuery();

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
              Algerian Dinars (DZD) in the{" "}
              <span className={TEXT_GRADIENT}>parallel</span> market
            </h1>
            <div className="text-xs lg:text-sm">
              Here we give you the daily prices of the big foreign currencies in
              the algerian parallel market.
            </div>
            <h2 className="text-lg lg:text-xl font-semibold underline font-mono">
              purchase
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
              sale
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
              Algerian Dinars (DZD) in the{" "}
              <span className={TEXT_GRADIENT}>official</span> market
            </h1>
            <div className="text-xs lg:text-sm">
              Here we give you the daily prices of the big foreign currencies in
              the algerian official market.
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
