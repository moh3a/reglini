import { Fragment, Dispatch, SetStateAction } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";

import { Wilaya } from "@prisma/client";
import {
  SHADOW,
  PADDING,
  BG_TRANSPARENT_BACKDROP,
  ROUNDED,
  TEXT_INPUT,
} from "../../../../config/design";
import Loading from "@components/shared/Loading";
import { trpc } from "@utils/trpc";
import { useTranslations } from "next-intl";

export default function SelectWilaya({
  wilaya,
  setWilaya,
}: {
  wilaya?: Wilaya;
  setWilaya: Dispatch<SetStateAction<Wilaya | undefined>>;
}) {
  const wilayasQuery = trpc.address.wilayas.useQuery();
  const t = useTranslations("AccountPage.details.address");

  return (
    <Listbox value={wilaya} onChange={setWilaya}>
      {({ open }) => (
        <>
          <div className="mt-1 relative">
            <Listbox.Button
              className={`relative flex w-full pl-3 pr-10 py-1 ${TEXT_INPUT} `}
            >
              <div className="flex-1 font-mono">{t("wilaya")}</div>
              <div className="flex-1 truncate">
                {wilaya ? wilaya.name : "Select.."}
              </div>
              <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
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
                className={`absolute z-10 mt-1 w-full max-h-56 overflow-auto ${SHADOW} ${PADDING} ${ROUNDED} ${BG_TRANSPARENT_BACKDROP}`}
              >
                {wilayasQuery.isLoading && (
                  <div className="w-full flex justify-center items-center">
                    <Loading size="medium" />
                  </div>
                )}
                {wilayasQuery.data?.wilayas.map((wilaya) => (
                  <Listbox.Option
                    key={wilaya.id}
                    className={({ active }) =>
                      `${
                        active ? "text-gray-500" : ""
                      } cursor-default select-none relative py-2 pl-3 pr-9`
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
