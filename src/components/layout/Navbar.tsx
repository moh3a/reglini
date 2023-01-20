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

import DarkMode from "../DarkMode";
import AccountBadge from "../auth/AccountBadge";
import Slideover from "./Slideover";
import Logo from "../shared/Logo";
import Language from "../Language";
import Button from "../shared/Button";
import Cart from "@components/account/Cart";
import SearchButton from "@components/aliexpress/SearchButton";
import { APP_NAME } from "@config/general";

const Navbar = () => {
  const t = useTranslations("Common.navigation");
  const router = useRouter();
  const [sideOpen, setSideOpen] = useState(false);

  return (
    <div className="mb-8 lg:mb-0">
      <div className="h-14 p-4 flex justify-between">
        {/* hamburger menu icon */}
        <div
          className="p-2 pointer-cursor flex-1 lg:hidden space-y-1.5"
          onClick={() => setSideOpen(!sideOpen)}
        >
          <span className="block w-5 h-0.5 bg-slate-600 dark:bg-slate-300"></span>
          <span className="block w-8 h-0.5 bg-slate-600 dark:bg-slate-300"></span>
          <span className="block w-8 h-0.5 bg-slate-600 dark:bg-slate-300"></span>
        </div>

        <Slideover open={sideOpen} setOpen={setSideOpen} />
        <div className="flex-1 flex justify-center relative bottom-2 lg:flex-none">
          <Link href="/" passHref>
            <span className="sr-only">{APP_NAME}</span>
            <Logo width="40" height="40" />
          </Link>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="hidden lg:block relative top-1">
            <DarkMode />
          </div>
          <div className="hidden lg:block rtl:mr-4 ltr:ml-4">
            <Language />
          </div>
          <div>
            <SearchButton />
          </div>
          <div className="ltr:mr-4 rtl:ml-4">
            <Cart />
          </div>
          {!router.asPath.includes("/auth") && <AccountBadge />}
        </div>
      </div>

      <nav className="hidden lg:flex justify-center mt-4 mb-8">
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
                  className={`inline rtl:ml-1 ltr:mr-1 ${
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
                    ? "underline underline-offset-2 decoration-double decoration-aliexpress"
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
                  className="h-5 w-5 inline rtl:ml-1 ltr:mr-1"
                  aria-hidden="true"
                />
              }
            >
              <span
                className={`text-grim dark:text-white ${
                  router.asPath.includes("/currency")
                    ? "underline underline-offset-2 decoration-double decoration-aliexpress"
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
                  className="h-5 w-5 inline rtl:ml-1 ltr:mr-1"
                  aria-hidden="true"
                />
              }
            >
              <span
                className={`text-grim dark:text-white ${
                  router.asPath.includes("/support")
                    ? "underline underline-offset-2 decoration-double decoration-aliexpress"
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
                  className="h-5 w-5 inline rtl:ml-1 ltr:mr-1"
                  aria-hidden="true"
                />
              }
            >
              <span
                className={`text-grim dark:text-white ${
                  router.asPath.includes("/faq")
                    ? "underline underline-offset-2 decoration-double decoration-aliexpress"
                    : "hover:underline hover:decoration-aliexpress"
                } `}
              >
                {t("faq")}
              </span>
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
