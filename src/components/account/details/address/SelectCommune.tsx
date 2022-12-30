import { Fragment, Dispatch, SetStateAction } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";

import { Commune } from "@prisma/client";
import {
  SHADOW,
  PADDING,
  BG_TRANSPARENT_BACKDROP,
  ROUNDED,
  TEXT_INPUT,
} from "@config/design";
import Loading from "@components/shared/Loading";
import { trpc } from "@utils/trpc";

export default function SelectCommune({
  daira,
  commune,
  setCommune,
}: {
  daira: string;
  commune?: Commune;
  setCommune: Dispatch<SetStateAction<Commune | undefined>>;
}) {
  const communesQuery = trpc.address.communes.useQuery({ daira });

  return (
    <Listbox value={commune} onChange={setCommune}>
      {({ open }) => (
        <>
          <div className="mt-1 relative">
            <Listbox.Button
              className={`relative text-left flex w-full pl-3 pr-10 py-1 ${TEXT_INPUT} `}
            >
              <div className="font-mono flex-1">City</div>
              <div className="flex-1 truncate">
                {commune ? commune.name : "Select.."}
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
                {communesQuery.isLoading && (
                  <div className="w-full flex justify-center items-center">
                    <Loading size="medium" />
                  </div>
                )}
                {communesQuery.data?.communes.map((commune) => (
                  <Listbox.Option
                    key={commune.id}
                    className={({ active }) =>
                      `${
                        active ? "text-gray-500" : ""
                      } cursor-default select-none relative py-2 pl-3 pr-9`
                    }
                    value={commune}
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
                            {commune.name}
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
