import { Fragment, Dispatch, SetStateAction } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

import { Post } from "@prisma/client";
import {
  SHADOW,
  PADDING,
  BG_TRANSPARENT_BACKDROP,
  ROUNDED,
  TEXT_INPUT,
} from "@config/design";
import Loading from "@components/shared/Loading";
import { trpc } from "@utils/trpc";

export default function SelectPost({
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
  const postsQuery = trpc.address.posts.useQuery(
    { commune, wilaya },
    {
      onSettled(data) {
        if (data && data.post) {
          setPostalCode(data.post);
        }
      },
    }
  );
  const t = useTranslations("AccountPage.details.address");

  return (
    <>
      {postsQuery.isLoading && (
        <div className="w-full flex justify-center items-center">
          <Loading size="medium" />
        </div>
      )}
      {postsQuery.data?.post && (
        <div
          className={`relative flex my-1 w-full pl-3 pr-10 py-1 ${TEXT_INPUT} `}
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
              <div className="mt-1 relative">
                <Listbox.Button
                  className={`relative flex w-full pl-3 pr-10 py-1 ${TEXT_INPUT} `}
                >
                  <div className="flex-1 font-mono">{t("postalCode")}</div>
                  <div className="flex-1 truncate">
                    {postalCode ? postalCode.zip_code : "Select.."}
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
                    {postsQuery.data?.posts?.map((post) => (
                      <Listbox.Option
                        key={post.id}
                        className={({ active }) =>
                          `${
                            active ? "text-gray-500" : ""
                          } cursor-default select-none relative py-2 pl-3 pr-9`
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
