/* eslint-disable @next/next/no-img-element */
import React, { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { Menu, Transition } from "@headlessui/react";
import { LanguageIcon } from "@heroicons/react/24/outline";

import { BG_TRANSPARENT_BACKDROP, ROUNDED, SHADOW } from "@config/design";
import Button from "@components/shared/Button";

const Badge = ({ text }: { text: string }) => {
  return (
    <span className="inline-block text-center text-xs w-6 h-6 rounded-full bg-aliexpress text-white p-1">
      {text}
    </span>
  );
};

const LANGUAGES = [
  { name: "Français", badge: <Badge text="fr" />, locale: "fr" },
  { name: "English", badge: <Badge text="en" />, locale: "en" },
  { name: "عربي", badge: <Badge text="ع" />, locale: "ar" },
];

const Language = () => {
  const router = useRouter();

  return (
    <Menu as="div" className="relative inline-block">
      <Menu.Button as="div">
        <Button
          variant="outline"
          icon={
            <LanguageIcon className="h-5 w-5 inline ltr:mr-1 rtl:ml-1 md:mx-0" />
          }
        >
          <span className="font-mono md:sr-only">Locale</span>
        </Button>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`origin-top-right absolute right-0 mt-2 ${ROUNDED} ${SHADOW} ${BG_TRANSPARENT_BACKDROP} z-100 ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          <div className="p-1 ">
            {LANGUAGES.map((language) => (
              <Menu.Item key={language.name}>
                {({ active }) => (
                  <Link
                    href={router.asPath}
                    className={classNames(
                      active || router.locale === language.locale
                        ? "bg-black/10 dark:bg-black/90"
                        : "",
                      `${ROUNDED} w-full px-4 py-2 text-sm flex`
                    )}
                    locale={language.locale}
                    onClick={() => Cookies.set("NEXT_LOCALE", language.locale)}
                  >
                    {language.badge}{" "}
                    <span className="ltr:ml-1 rtl:mr-1 relative top-0.5">
                      {language.name}
                    </span>
                  </Link>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default Language;
