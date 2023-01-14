import { Fragment, useState, useEffect, Dispatch, SetStateAction } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";

import {
  BG_TRANSPARENT_BACKDROP,
  ROUNDED,
  SHADOW,
  TEXT_INPUT,
} from "@config/design";
import { DS_ShippingAPI_Shipping_Info_Result } from "@reglini-types/ae";
import { GetPrice } from "@utils/index";
import { useFinance } from "@utils/store";
import { useTranslations } from "next-intl";

interface ProductShipping {
  shipping: DS_ShippingAPI_Shipping_Info_Result;
  setSelectedShipping: Dispatch<
    SetStateAction<
      | DS_ShippingAPI_Shipping_Info_Result["result"]["aeop_freight_calculate_result_for_buyer_d_t_o_list"][0]
      | undefined
    >
  >;
}

const ProductShipping = ({
  shipping,
  setSelectedShipping,
}: ProductShipping) => {
  const t = useTranslations("AliexpressPage");
  const { usd, commission } = useFinance();
  const [selected, setSelected] = useState(
    shipping.result.aeop_freight_calculate_result_for_buyer_d_t_o_list[0]
  );
  useEffect(() => {
    if (selected) setSelectedShipping(selected);
  }, [selected, setSelectedShipping]);

  return (
    <div className={`text-left z-10 mt-4`}>
      {shipping.result.success ? (
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
                    {selected.service_name}
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
                    {shipping.result.aeop_freight_calculate_result_for_buyer_d_t_o_list.map(
                      (carrier, carrierIdx) => (
                        <Listbox.Option
                          key={carrierIdx}
                          className={({ active }) =>
                            `${active ? "font-extrabold" : ""}
                          select-none relative py-2 pl-10 pr-4`
                          }
                          value={carrier}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`${
                                  selected ? "font-bold" : "font-normal"
                                } block truncate`}
                              >
                                {carrier.service_name}
                              </span>
                              <span className="text-xs">
                                {t("shipping.deliveredIn", {
                                  time: carrier.estimated_delivery_time,
                                })}
                              </span>

                              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                {t("price", {
                                  price: GetPrice(
                                    usd ?? 0,
                                    commission ?? 0,
                                    carrier.freight.amount
                                  ),
                                })}
                              </span>
                              {selected ? (
                                <span
                                  className={`text-success absolute inset-y-0 left-0 flex items-center pl-3`}
                                >
                                  <CheckIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      )
                    )}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          <p className="relative text-xs pl-2 z-0">
            <span>
              {t("shipping.deliveredIn", {
                time: selected.estimated_delivery_time,
              })}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
              {t("price", {
                price: GetPrice(
                  usd ?? 0,
                  commission ?? 0,
                  selected.freight.amount
                ),
              })}
            </span>
          </p>
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
