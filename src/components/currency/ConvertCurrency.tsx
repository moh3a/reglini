import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import type { CURRENCIES } from "@prisma/client";

import {
  BG_TRANSPARENT_BACKDROP,
  PADDING,
  ROUNDED,
  SHADOW,
  TEXT_GRADIENT,
} from "~/config/design";
import { Loading, NumberInput } from "~/components/shared";
import { api } from "~/utils/api";
import { useTranslations } from "next-intl";

const ConvertCurrency = () => {
  const [selectedDevise, setSelectedDevise] = useState<{
    exchange: CURRENCIES;
  }>({
    exchange: "EUR",
  });
  const [rate, setRate] = useState<number>(1);
  const [money, setMoney] = useState({ dzd: 0, devise: 0 });

  const currenciesQuery = api.currency.currencies.useQuery();
  useEffect(() => {
    if (currenciesQuery?.data?.currencies?.[0]) {
      setMoney({
        dzd: currenciesQuery.data.currencies[0].parallel_sale ?? 0,
        devise: currenciesQuery.data.currencies[0].parallel_sale ? 1 : 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currenciesQuery.data?.currencies) {
      const index = currenciesQuery.data.currencies.findIndex(
        (e) => e?.exchange === selectedDevise.exchange,
      );
      if (currenciesQuery.data.currencies[index] && index !== -1)
        setRate(currenciesQuery.data.currencies[index]?.parallel_sale ?? 0);
    }
  }, [currenciesQuery.data, selectedDevise.exchange]);

  useEffect(() => {
    setMoney({ dzd: rate, devise: 1 });
  }, [rate]);

  const t = useTranslations("CurrencyPage.convertCurrency");

  return (
    <>
      {currenciesQuery.isLoading && (
        <div className="flex w-full items-center justify-center">
          <Loading size="large" />
        </div>
      )}
      {currenciesQuery.data?.currencies && (
        <div className="flex flex-col items-center px-4 py-32 lg:py-44">
          <h1 className="text-center text-xl font-bold lg:text-4xl">
            {t.rich("intro", {
              exchange: selectedDevise.exchange,
              gradient: (chunks) => (
                <span className="bg-gradient-to-r from-green-600 to-red-400 bg-clip-text text-transparent">
                  {chunks}
                </span>
              ),
              highlight: (chunks) => (
                <span className={TEXT_GRADIENT}>{chunks}</span>
              ),
            })}
          </h1>
          <form className="lg:min-w-128 mx-auto mt-8 flex flex-col items-center lg:flex-row lg:justify-around">
            <div className="relative m-2">
              <label htmlFor="dzd" className="sr-only">
                From Algerian Dinars
              </label>
              <NumberInput
                id="dzd"
                name="dzd"
                value={money.dzd}
                onChange={(e) => {
                  setMoney({
                    devise:
                      Math.round((parseFloat(e.target.value) * 100) / rate) /
                      100,
                    dzd: parseFloat(e.target.value),
                  });
                }}
              />
              <span className="pointer-events-none absolute inset-y-0 right-5 flex items-center pr-2 text-gray-500">
                DZD
              </span>
            </div>
            <div className="relative m-2">
              <label htmlFor="toUnit" className="sr-only">
                To devise
              </label>
              <NumberInput
                id="devise"
                name="devise"
                value={money.devise}
                onChange={(e) => {
                  setMoney({
                    devise: parseFloat(e.target.value),
                    dzd: parseFloat(e.target.value) * rate,
                  });
                }}
              />
              <span className="pointer-events-none absolute inset-y-0 right-5 flex items-center pr-2 text-gray-500">
                {selectedDevise.exchange === "EUR"
                  ? "€"
                  : selectedDevise.exchange === "USD"
                  ? "$"
                  : "£"}
              </span>
            </div>
            <Listbox
              value={selectedDevise.exchange}
              onChange={(value) => setSelectedDevise({ exchange: value })}
            >
              <div className="relative">
                <Listbox.Button
                  className={`cursor-pointer border-0 border-b border-grim text-sm dark:border-aliexpress ${SHADOW} ${ROUNDED} ${PADDING} ${BG_TRANSPARENT_BACKDROP}`}
                >
                  <span className="block truncate pr-4">
                    {selectedDevise.exchange}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 bottom-1 right-1 flex items-center">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options
                    className={`absolute mt-1 max-h-60 overflow-auto py-1 text-base sm:text-sm ${SHADOW} ${ROUNDED} ${BG_TRANSPARENT_BACKDROP}`}
                  >
                    {currenciesQuery.data.currencies.map(
                      (currency) =>
                        currency && (
                          <Listbox.Option
                            key={currency.exchange}
                            className={({ selected }) =>
                              `${
                                selected
                                  ? "bg-aliexpress font-extrabold text-white"
                                  : ""
                              }
                          relative cursor-pointer select-none py-1 pl-8 pr-2 hover:bg-black/5 dark:hover:bg-black/50`
                            }
                            value={currency.exchange}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`${
                                    selected ? "font-bold" : "font-normal"
                                  } block truncate`}
                                >
                                  {currency.exchange}
                                </span>
                                {selected ? (
                                  <span
                                    className={`absolute inset-y-0 left-0 flex items-center pl-2 text-white`}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ),
                    )}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </form>
        </div>
      )}
    </>
  );
};

export default ConvertCurrency;
