import {
  Fragment,
  useState,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

import type {
  ZAE_ProductShipping,
  ZAE_ProductShippingCarrier,
} from "~/types/zapiex";
import {
  BG_TRANSPARENT_BACKDROP,
  ROUNDED,
  SHADOW,
  TEXT_INPUT,
} from "~/config/design";
import { GetPrice } from "~/utils/index";
import { useFinance } from "~/utils/store";

interface ProductShippingProps {
  shipping?: ZAE_ProductShipping;
  setSelectedShipping: Dispatch<
    SetStateAction<ZAE_ProductShippingCarrier | undefined>
  >;
}

export const ProductShipping = ({
  shipping,
  setSelectedShipping,
}: ProductShippingProps) => {
  const t = useTranslations("AliexpressPage");
  const { commission, euro } = useFinance();
  const [selected, setSelected] = useState<
    ZAE_ProductShippingCarrier | undefined
  >(
    shipping?.carriers && shipping.carriers.length > 0
      ? shipping.carriers[0]
      : undefined,
  );
  useEffect(() => {
    if (selected) setSelectedShipping(selected);
  }, [selected, setSelectedShipping]);

  return (
    <div className={`z-10 mt-4`}>
      {shipping && shipping.isAvailableForSelectedCountries ? (
        <>
          <p className={`text-center font-mono uppercase text-success`}>
            {t("shipping.shippingAvailable")}
          </p>
          <p>{t("shipping.carriers")}:</p>
          <div>
            <Listbox value={selected} onChange={setSelected}>
              <div className="relative mt-1">
                <Listbox.Button className={TEXT_INPUT + " w-full"}>
                  <span className="block truncate">
                    {selected ? selected.company.name : ""}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options
                    className={`absolute mt-1 w-full py-1 ${BG_TRANSPARENT_BACKDROP} ${ROUNDED} ${SHADOW} z-100 max-h-60 overflow-auto text-sm focus:outline-none`}
                  >
                    {shipping.carriers?.map((carrier, carrierIdx) => (
                      <Listbox.Option
                        key={carrierIdx}
                        className={({ active }) =>
                          `${active ? "font-extrabold" : ""}
                          relative select-none py-2 pl-10 pr-4`
                        }
                        value={carrier}
                      >
                        {({ selected, active }) => (
                          <div
                            className={selected ? "font-bold" : "font-normal"}
                          >
                            <div className="flex justify-between">
                              <div
                                className={`${
                                  active && "font-extrabold"
                                } truncate`}
                              >
                                {carrier.company.name}
                              </div>
                              {selected && (
                                <div className={`text-success`}>
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex justify-between text-xs">
                              {carrier.estimatedDeliveryDate ? (
                                <div>
                                  {t("shipping.deliveredIn", {
                                    time: carrier.estimatedDeliveryDate,
                                  })}
                                </div>
                              ) : (
                                <div>carrier.estimatedDeliveryDate</div>
                              )}
                              <div>
                                {t("price", {
                                  price: GetPrice(
                                    euro ?? 0,
                                    commission ?? 0,
                                    carrier.price.value,
                                  ),
                                })}
                              </div>
                            </div>

                            {carrier.hasTracking ? (
                              <span className="block truncate text-xs text-success">
                                Carrier has tracking
                              </span>
                            ) : (
                              <span className="block truncate text-xs text-danger">
                                Carrier does not have tracking
                              </span>
                            )}
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          {selected && (
            <div className="z-0 flex justify-between text-xs">
              <div>
                {t("shipping.deliveredIn", {
                  time: selected.estimatedDeliveryDate,
                })}
              </div>
              <div>
                {t("price", {
                  price: GetPrice(
                    euro ?? 0,
                    commission ?? 0,
                    selected.price.value,
                  ),
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-center font-mono uppercase text-danger">
          {t("shipping.shippingNotAvailable")}
        </p>
      )}
    </div>
  );
};
