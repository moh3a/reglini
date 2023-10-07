import { Fragment, type Dispatch, type SetStateAction } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

import type { Post } from "@prisma/client";
import {
  SHADOW,
  PADDING,
  BG_TRANSPARENT_BACKDROP,
  ROUNDED,
  TEXT_INPUT,
} from "~/config/design";
import { Loading } from "~/components/shared";
import { api } from "~/utils/api";

export function SelectPost({
  commune,
  wilaya,
  postalCode,
  setPostalCode,
}: {
  commune: string;
  wilaya: string;
  postalCode?: Post;
  setPostalCode: Dispatch<SetStateAction<Post | undefined>>;
}) {
  const postsQuery = api.address.posts.useQuery(
    { commune, wilaya },
    {
      onSettled(data) {
        if (data?.post) {
          setPostalCode(data.post);
        }
      },
    },
  );
  const t = useTranslations("AccountPage.details.address");

  return (
    <>
      {postsQuery.isLoading && (
        <div className="flex w-full items-center justify-center">
          <Loading size="medium" />
        </div>
      )}
      {postsQuery.data?.post && (
        <div
          className={`relative my-1 flex w-full py-1 pl-3 pr-10 ${TEXT_INPUT} `}
        >
          <div className="flex-1 font-mono">{t("postalCode")}</div>
          <div className="flex-1 truncate">
            {postalCode ? postalCode.zip_code : "Select.."}
          </div>
        </div>
      )}
      {postsQuery.data?.posts && (
        <Listbox value={postalCode} onChange={setPostalCode}>
          {({ open }) => (
            <>
              <div className="relative mt-1">
                <Listbox.Button
                  className={`relative flex w-full py-1 pl-3 pr-10 ${TEXT_INPUT} `}
                >
                  <div className="flex-1 font-mono">{t("postalCode")}</div>
                  <div className="flex-1 truncate">
                    {postalCode ? postalCode.zip_code : "Select.."}
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
                    {postsQuery.data?.posts?.map((post) => (
                      <Listbox.Option
                        key={post.id}
                        className={({ active }) =>
                          `${
                            active ? "text-gray-500" : ""
                          } relative cursor-default select-none py-2 pl-3 pr-9`
                        }
                        value={post}
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
                                {post.zip_code} - {post.post}
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
      )}
    </>
  );
}
