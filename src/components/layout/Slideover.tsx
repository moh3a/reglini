import { Dispatch, Fragment, SetStateAction } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowLeftOnRectangleIcon,
  PowerIcon,
  UserPlusIcon,
  XMarkIcon,
  Cog6ToothIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

import DarkMode from "../DarkMode";
import Language from "../Language";
import { BG_GRADIENT } from "@config/design";
import Button from "@components/shared/Button";

export default function Slideover({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: session } = useSession();
  const t = useTranslations("Common");
  const router = useRouter();
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-opacity-50 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-32">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="-translate-x-full"
                enterTo="-translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="-translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-8 flex pt-4 pl-2 sm:-mr-10 sm:pl-4">
                      <button
                        type="button"
                        className={`text-contentDark hover:text-primary `}
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col bg-white dark:bg-grim py-6 shadow-xl">
                    <div className="relative h-full mt-6 flex-1 px-4 sm:px-6">
                      {/* Replace with your content */}
                      <div className="px-6">
                        <div className="mb-10">
                          {session && session.user ? (
                            <nav>
                              <div>
                                <Link href={"/account"}>
                                  <Button
                                    icon={
                                      <Cog6ToothIcon
                                        className="inline h-5 w-5 mr-2"
                                        aria-hidden="true"
                                      />
                                    }
                                    variant="outline"
                                  >
                                    {t("badge.account")}
                                  </Button>
                                </Link>
                              </div>
                              <div>
                                <Link href={"/account/wishlist"}>
                                  <Button
                                    icon={
                                      <HeartIcon
                                        className="inline h-5 w-5 mr-2"
                                        aria-hidden="true"
                                      />
                                    }
                                    variant="outline"
                                  >
                                    {t("badge.wishlist")}
                                  </Button>
                                </Link>
                              </div>
                              <div>
                                <Link href={"/account/orders"}>
                                  <Button
                                    icon={
                                      <Square3Stack3DIcon
                                        className="inline h-5 w-5 mr-2"
                                        aria-hidden="true"
                                      />
                                    }
                                    variant="outline"
                                  >
                                    {t("badge.orders")}
                                  </Button>
                                </Link>
                              </div>
                              <div>
                                <Button
                                  icon={
                                    <PowerIcon
                                      className="inline h-5 w-5 mr-2"
                                      aria-hidden="true"
                                    />
                                  }
                                  onClick={() => signOut()}
                                  variant="outline"
                                >
                                  {t("badge.signOut")}
                                </Button>
                              </div>
                            </nav>
                          ) : (
                            <nav>
                              <div>
                                <Link href={"/auth/login"}>
                                  <Button
                                    icon={
                                      <ArrowLeftOnRectangleIcon
                                        className="inline h-5 w-5 mr-2"
                                        aria-hidden="true"
                                      />
                                    }
                                    variant="outline"
                                  >
                                    {t("navigation.login")}
                                  </Button>
                                </Link>
                              </div>
                              <div>
                                <Link href={"/auth/register"}>
                                  <Button
                                    icon={
                                      <UserPlusIcon
                                        className="inline h-5 w-5 mr-2"
                                        aria-hidden="true"
                                      />
                                    }
                                    variant="outline"
                                  >
                                    {t("navigation.register")}
                                  </Button>
                                </Link>
                              </div>
                            </nav>
                          )}
                        </div>
                        <div className="my-20">
                          <h2 className="mt-8 font-mono font-bold text-lg px-4 sm:px-6">
                            Navigation
                          </h2>

                          <nav className="flex-col my-4">
                            <div
                              className={`mx-4 font-bold ${
                                router.asPath === "/aliexpress"
                                  ? `py-1 px-3 rounded-r-full ${BG_GRADIENT} text-white`
                                  : ""
                              }`}
                            >
                              <Link href="/aliexpress">
                                {t("navigation.aliexpress")}
                              </Link>
                            </div>
                            <div
                              className={`mx-4 font-bold ${
                                router.asPath === "/currency"
                                  ? `py-1 px-3 rounded-r-full ${BG_GRADIENT} text-white`
                                  : ""
                              }`}
                            >
                              <Link href="/currency">
                                {t("navigation.currency")}
                              </Link>
                            </div>
                            <div
                              className={`mx-4 font-bold ${
                                router.asPath === "/support"
                                  ? `py-1 px-3 rounded-r-full ${BG_GRADIENT} text-white`
                                  : ""
                              }`}
                            >
                              <Link href="/support">
                                {t("navigation.support")}
                              </Link>
                            </div>
                            <div
                              className={`mx-4 font-bold ${
                                router.asPath === "/faq"
                                  ? `py-1 px-3 rounded-r-full ${BG_GRADIENT} text-white`
                                  : ""
                              }`}
                            >
                              <Link href="/faq">{t("navigation.faq")}</Link>
                            </div>
                          </nav>
                        </div>
                        <div className="mt-10">
                          <div className="flex justify-center">
                            <DarkMode />
                          </div>
                          <div className="flex justify-center">
                            <Language />{" "}
                            <span className="font-bold relative top-1 font-mono">
                              Locale
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* /End replace */}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
