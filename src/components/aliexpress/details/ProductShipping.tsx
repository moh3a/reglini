import { Fragment, useState, useEffect, Dispatch, SetStateAction } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";

import { ZAE_Product } from "@config/zapiex";
import {
  BG_TRANSPARENT_BACKDROP,
  ROUNDED,
  SHADOW,
  TEXT_INPUT,
} from "@config/design";

interface ProductShipping {
  product: ZAE_Product;
  setSelectedShipping: Dispatch<
    SetStateAction<ZAE_Product["shipping"]["carriers"]["0"]>
  >;
}

const ProductShipping = ({ product, setSelectedShipping }: any) => {
  const [selected, setSelected] = useState(product.shipping.carriers[0]);
  useEffect(() => {
    if (selected) setSelectedShipping(selected);
  }, [selected, setSelectedShipping]);

  return (
    <div className={`text-left z-10 mt-4`}>
      {product.shipping.isAvailableForSelectedCountries ? (
        <>
          <p className={`text-success font-mono text-center uppercase`}>
            THIS ITEM IS AVAILABLE FOR SHIPPING TO ALGERIA
          </p>
          <p>Shipping Carriers:</p>
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
                            <>
                              <span
                                className={`${
                                  selected ? "font-bold" : "font-normal"
                                } block truncate`}
                              >
                                {carrier.company.name}
                              </span>
                              <span className="text-xs">
                                Delivered in {carrier.deliveryTimeInDays.min} -{" "}
                                {carrier.deliveryTimeInDays.max} days
                              </span>

                              {carrier.hasTracking ? (
                                <span className="text-xs text-success block truncate">
                                  Carrier has tracking
                                </span>
                              ) : (
                                <span className="text-xs text-danger block truncate">
                                  Carrier does not have tracking
                                </span>
                              )}
                              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                {carrier.price.value} €
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
              Delivered in {selected.deliveryTimeInDays.min} -{" "}
              {selected.deliveryTimeInDays.max} days
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
              {selected.price.value} €
            </span>
          </p>
        </>
      ) : (
        <p className="text-danger text-center uppercase font-mono">
          Item not available for shipping to Algeria.
        </p>
      )}
    </div>
  );
};
export default ProductShipping;
