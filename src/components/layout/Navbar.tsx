/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import {
  AtSymbolIcon,
  CurrencyEuroIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";

import { APP_NAME } from "~/config/constants";
import Slideover from "~/components/layout/Slideover";
import AccountBadge from "~/components/auth/AccountBadge";
import DarkMode from "~/components/DarkMode";
import Language from "~/components/Language";
import Cart from "~/components/account/cart/Slideover";
import { SearchButton } from "~/components/aliexpress";
import { Button } from "~/components/shared";
import Install from "~/components/Install";

const Navbar = () => {
  const t = useTranslations("Common.navigation");
  const router = useRouter();
  const [sideOpen, setSideOpen] = useState(false);

  return (
    <div
      className={`mb-8 border-t-4 border-t-aliexpress md:border-t-8 lg:mb-0`}
    >
      <div className="flex h-14 justify-between p-4">
        {/* hamburger menu icon */}
        <div
          className="pointer-cursor flex-1 space-y-1.5 p-2 lg:hidden"
          onClick={() => setSideOpen(!sideOpen)}
        >
          <span className="block h-0.5 w-5 bg-slate-600 dark:bg-slate-300"></span>
          <span className="block h-0.5 w-8 bg-slate-600 dark:bg-slate-300"></span>
          <span className="block h-0.5 w-8 bg-slate-600 dark:bg-slate-300"></span>
        </div>

        <Slideover open={sideOpen} setOpen={setSideOpen} />
        <div className="relative bottom-2 flex flex-1 justify-center lg:flex-none">
          <Link href="/" passHref>
            <span className="sr-only">{APP_NAME}</span>
            <img src="/favicon.ico" alt="reglini logo" width={40} height={40} />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <div className="hidden font-mono lg:block">
            <Install />
          </div>
          <div>
            <SearchButton />
          </div>
          <div className="relative top-1 mx-2 hidden lg:block">
            <DarkMode />
          </div>
          <div className="hidden lg:block">
            <Language />
          </div>
          <div className="ltr:mr-2 rtl:ml-2">
            <Cart />
          </div>
          {!router.asPath.includes("/auth") && (
            <div>
              <AccountBadge />
            </div>
          )}
        </div>
      </div>

      {router.asPath !== "/" && (
        <nav className="mb-8 mt-4 hidden justify-center lg:flex">
          <div
            className={`mx-4 font-bold hover:text-aliexpress ${
              router.asPath.includes("/aliexpress")
                ? "text-aliexpress"
                : "grayscale hover:grayscale-0"
            }`}
          >
            <Link href={"/aliexpress"}>
              <Button
                variant="outline"
                icon={
                  <img
                    src="/AliexpressIcon.svg"
                    alt="page logo"
                    className={`inline ltr:mr-1 rtl:ml-1 ${
                      router.asPath.includes("/aliexpress") ? "grayscale-0" : ""
                    } `}
                    height={20}
                    width={20}
                  />
                }
              >
                <span
                  className={`text-grim dark:text-white ${
                    router.asPath.includes("/aliexpress")
                      ? "underline decoration-aliexpress decoration-double underline-offset-2"
                      : "hover:underline hover:decoration-aliexpress"
                  } `}
                >
                  {t("aliexpress")}
                </span>
              </Button>
            </Link>
          </div>
          <div
            className={`mx-4 font-bold hover:text-aliexpress ${
              router.asPath.includes("/currency")
                ? "text-aliexpress"
                : "grayscale hover:grayscale-0"
            }`}
          >
            <Link href={"/currency"}>
              <Button
                variant="outline"
                icon={
                  <CurrencyEuroIcon
                    className="inline h-5 w-5 ltr:mr-1 rtl:ml-1"
                    aria-hidden="true"
                  />
                }
              >
                <span
                  className={`text-grim dark:text-white ${
                    router.asPath.includes("/currency")
                      ? "underline decoration-aliexpress decoration-double underline-offset-2"
                      : "hover:underline hover:decoration-aliexpress"
                  } `}
                >
                  {t("currency")}
                </span>
              </Button>
            </Link>
          </div>
          <div
            className={`mx-4 font-bold hover:text-aliexpress ${
              router.asPath.includes("/support")
                ? "text-aliexpress"
                : "grayscale hover:grayscale-0"
            }`}
          >
            <Link href={"/support"}>
              <Button
                variant="outline"
                icon={
                  <AtSymbolIcon
                    className="inline h-5 w-5 ltr:mr-1 rtl:ml-1"
                    aria-hidden="true"
                  />
                }
              >
                <span
                  className={`text-grim dark:text-white ${
                    router.asPath.includes("/support")
                      ? "underline decoration-aliexpress decoration-double underline-offset-2"
                      : "hover:underline hover:decoration-aliexpress"
                  } `}
                >
                  {t("support")}
                </span>
              </Button>
            </Link>
          </div>
          <div
            className={`mx-4 font-bold hover:text-aliexpress ${
              router.asPath.includes("/faq")
                ? "text-aliexpress"
                : "grayscale hover:grayscale-0"
            }`}
          >
            <Link href={"/faq"}>
              <Button
                variant="outline"
                icon={
                  <QuestionMarkCircleIcon
                    className="inline h-5 w-5 ltr:mr-1 rtl:ml-1"
                    aria-hidden="true"
                  />
                }
              >
                <span
                  className={`text-grim dark:text-white ${
                    router.asPath.includes("/faq")
                      ? "underline decoration-aliexpress decoration-double underline-offset-2"
                      : "hover:underline hover:decoration-aliexpress"
                  } `}
                >
                  {t("faq")}
                </span>
              </Button>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
