import { Fragment, type Dispatch, type SetStateAction } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

import type { Wilaya } from "@prisma/client";
import {
  SHADOW,
  PADDING,
  BG_TRANSPARENT_BACKDROP,
  ROUNDED,
  TEXT_INPUT,
} from "~/config/design";
import { Loading } from "~/components/shared";
import { api } from "~/utils/api";

export function SelectWilaya({
  wilaya,
  setWilaya,
}: {
  wilaya?: Wilaya;
  setWilaya: Dispatch<SetStateAction<Wilaya | undefined>>;
}) {
  const wilayasQuery = api.address.wilayas.useQuery();
  const t = useTranslations("AccountPage.details.address");

  return (
    <Listbox value={wilaya} onChange={setWilaya}>
      {({ open }) => (
        <>
          <div className="relative mt-1">
            <Listbox.Button
              className={`relative flex w-full py-1 pl-3 pr-10 ${TEXT_INPUT} `}
            >
              <div className="flex-1 font-mono">{t("wilaya")}</div>
              <div className="flex-1 truncate">
                {wilaya ? wilaya.name : "Select.."}
              </div>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className={`absolute z-10 mt-1 max-h-56 w-full overflow-auto ${SHADOW} ${PADDING} ${ROUNDED} ${BG_TRANSPARENT_BACKDROP}`}
              >
                {wilayasQuery.isLoading && (
                  <div className="flex w-full items-center justify-center">
                    <Loading size="medium" />
                  </div>
                )}
                {wilayasQuery.data?.wilayas.map((wilaya) => (
                  <Listbox.Option
                    key={wilaya.id}
                    className={({ active }) =>
                      `${
                        active ? "text-gray-500" : ""
                      } relative cursor-default select-none py-2 pl-3 pr-9`
                    }
                    value={wilaya}
                  >
                    {({ selected }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={`${
                              selected ? "font-bold" : "font-normal"
                            }
                              ml-3 block truncate`}
                          >
                            {wilaya.id} - {wilaya.name}
                          </span>
                        </div>

                        {selected && (
                          <span
                            className={`absolute inset-y-0 right-0 flex items-center pr-4`}
                          >
                            <CheckIcon
                              className="h-5 w-5 text-success"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
