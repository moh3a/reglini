/* eslint-disable @next/next/no-img-element */
import { FormEvent, Fragment, useState } from "react";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { Button } from "~/components/shared";
import { ROUNDED, TEXT_INPUT } from "~/config/design";

export const SearchButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const router = useRouter();

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    if (url.includes("aliexpress.com/item/")) {
      const firstSplit = url.split("/item/");
      const secondSplit = firstSplit[1]?.split(".html");
      if (secondSplit) router.push(`/aliexpress/product/${secondSplit[0]}`);
    } else {
      router.push(`/aliexpress?q=${url}`);
    }
    setIsOpen(false);
    setUrl("");
  };

  const t = useTranslations("Common.aliexpress");

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <span className="sr-only">search aliexpress</span>
        <MagnifyingGlassIcon className="h-5 w-5 inline" aria-hidden="true" />
      </Button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-opacity-50 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`max-w-xl w-full transform align-middle transition-all`}
                >
                  <form
                    onSubmit={submitHandler}
                    className={`relative w-full max-w-xl m-auto bg-white dark:bg-grim ${ROUNDED}`}
                  >
                    <input
                      className={`w-full py-2 pl-7 pr-7 ${TEXT_INPUT} `}
                      placeholder={t("search")}
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      autoComplete="off"
                    />
                    <div className="absolute top-1.5 left-1 select-none">
                      <img
                        src={"/AliexpressIcon.svg"}
                        alt="aliexpress logo"
                        height={20}
                        width={20}
                      />
                    </div>
                    <div className="absolute top-0 -right-1">
                      <Button variant="outline" type="submit">
                        <span className="sr-only">search aliexpress</span>
                        <MagnifyingGlassIcon
                          className="h-5 w-5 inline"
                          aria-hidden="true"
                        />
                      </Button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
