import { Fragment, useState, useEffect, Dispatch, SetStateAction } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";

import { ZAE_Product } from "@reglini-types/zapiex";
import {
  BG_TRANSPARENT_BACKDROP,
  ROUNDED,
  SHADOW,
  TEXT_INPUT,
} from "@config/design";
import { GetPrice } from "@utils/index";
import { useFinance } from "@utils/store";
import { useTranslations } from "next-intl";

interface ProductShipping {
  product: ZAE_Product;
  setSelectedShipping: Dispatch<
    SetStateAction<ZAE_Product["shipping"]["carriers"]["0"]>
  >;
}

const ProductShipping = ({ product, setSelectedShipping }: any) => {
  const t = useTranslations("AliexpressPage");
  const { commission, euro } = useFinance();
  const [selected, setSelected] = useState(product.shipping.carriers[0]);
  useEffect(() => {
    if (selected) setSelectedShipping(selected);
  }, [selected, setSelectedShipping]);

  return (
    <div className={`z-10 mt-4`}>
      {product.shipping.isAvailableForSelectedCountries ? (
        <>
          <p className={`text-success font-mono text-center uppercase`}>
            {t("shipping.shippingAvailable")}
          </p>
          <p>{t("shipping.carriers")}:</p>
          <div>
            <Listbox value={selected} onChange={setSelected}>
              <div className="relative mt-1">
                <Listbox.Button className={TEXT_INPUT + " w-full"}>
                  <span className="block truncate">
                    {selected.company.name}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronUpDownIcon
                      className="w-5 h-5 text-gray-400"
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
                    className={`absolute w-full py-1 mt-1 ${BG_TRANSPARENT_BACKDROP} ${ROUNDED} ${SHADOW} max-h-60 overflow-auto focus:outline-none text-sm z-100`}
                  >
                    {product.shipping.carriers.map(
                      (carrier: any, carrierIdx: number) => (
                        <Listbox.Option
                          key={carrierIdx}
                          className={({ active }) =>
                            `${active ? "font-extrabold" : ""}
                          select-none relative py-2 pl-10 pr-4`
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
                                      className="w-5 h-5"
                                      aria-hidden="true"
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex justify-between text-xs">
                                <div>
                                  {t("shipping.deliveredIn", {
                                    time:
                                      carrier.deliveryTimeInDays.min +
                                      " - " +
                                      carrier.deliveryTimeInDays.max,
                                  })}
                                </div>
                                <div>
                                  {t("price", {
                                    price: GetPrice(
                                      euro ?? 0,
                                      commission ?? 0,
                                      carrier.price.value
                                    ),
                                  })}
                                </div>
                              </div>

                              {carrier.hasTracking ? (
                                <span className="text-xs text-success block truncate">
                                  Carrier has tracking
                                </span>
                              ) : (
                                <span className="text-xs text-danger block truncate">
                                  Carrier does not have tracking
                                </span>
                              )}
                            </div>
                          )}
                        </Listbox.Option>
                      )
                    )}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          <div className="flex justify-between text-xs z-0">
            <div>
              {t("shipping.deliveredIn", {
                time:
                  selected.deliveryTimeInDays.min +
                  " - " +
                  selected.deliveryTimeInDays.max,
              })}
            </div>
            <div>
              {t("price", {
                price: GetPrice(
                  euro ?? 0,
                  commission ?? 0,
                  selected.price.value
                ),
              })}
            </div>
          </div>
        </>
      ) : (
        <p className="text-danger text-center uppercase font-mono">
          {t("shipping.shippingNotAvailable")}
        </p>
      )}
    </div>
  );
};
export default ProductShipping;
