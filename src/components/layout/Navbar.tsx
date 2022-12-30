/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

import { PAGES } from "@config/navigation";
import DarkMode from "../DarkMode";
import AccountBadge from "../auth/AccountBadge";
import Slideover from "./Slideover";
import Logo from "../shared/Logo";
import Language from "../Language";
import Button from "../shared/Button";
import Cart from "@components/account/Cart";

const Navbar = () => {
  const [sideOpen, setSideOpen] = useState(false);

  const router = useRouter();

  return (
    <div className="mb-8 lg:mb-0">
      <div className="h-14 p-4 flex justify-between">
        {/* hamburger menu icon */}
        <div
          className="flex-1 lg:hidden space-y-1.5"
          onClick={() => setSideOpen(!sideOpen)}
        >
          <span className="block w-5 h-0.5 bg-slate-600 dark:bg-slate-300"></span>
          <span className="block w-8 h-0.5 bg-slate-600 dark:bg-slate-300"></span>
          <span className="block w-8 h-0.5 bg-slate-600 dark:bg-slate-300"></span>
        </div>
        <Slideover open={sideOpen} setOpen={setSideOpen} />
        <div className="flex-1 flex justify-center relative bottom-2 lg:flex-none">
          <Link href="/" passHref>
            <span className="sr-only">reglini-dz</span>
            <Logo width="40" height="40" />
          </Link>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="hidden lg:block relative top-1">
            <DarkMode />
          </div>
          <div className="hidden lg:block ml-4">
            <Language />
          </div>
          <div className="mr-4">
            <Cart />
          </div>
          {!router.asPath.includes("/auth") && <AccountBadge />}
        </div>
      </div>

      <nav className="hidden lg:flex justify-center mt-4 mb-8">
        {PAGES.map((page) => (
          <div
            key={page.name}
            className={`mx-4 font-bold hover:text-aliexpress ${
              router.asPath.includes(page.url)
                ? "text-aliexpress"
                : "grayscale hover:grayscale-0"
            }`}
          >
            <Link href={page.url}>
              <Button
                variant="outline"
                icon={
                  page.logo.type === "svg" ? (
                    <img
                      src={page.logo.path}
                      alt="page logo"
                      className={`inline mr-1 ${
                        router.asPath.includes(page.url) ? "grayscale-0" : ""
                      } `}
                      height={20}
                      width={20}
                    />
                  ) : (
                    page.logo.component
                  )
                }
              >
                <span
                  className={`text-grim dark:text-white ${
                    router.asPath.includes(page.url)
                      ? "underline underline-offset-2 decoration-double decoration-aliexpress"
                      : "hover:underline hover:decoration-aliexpress"
                  } `}
                >
                  {page.name}
                </span>
              </Button>
            </Link>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Navbar;
