/* eslint-disable @next/next/no-img-element */
import { Fragment } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import {
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  PowerIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

import {
  BG_TRANSPARENT_BACKDROP,
  PADDING,
  ROUNDED,
  SHADOW,
} from "@config/design";
import Button from "../shared/Button";
import Loading from "@components/shared/Loading";

const AccountBadge = () => {
  const { data: session, status } = useSession();
  const t = useTranslations("Common.badge");

  if (status === "unauthenticated") {
    return (
      <Link href={"/auth/login"}>
        <Button
          variant="outline"
          icon={
            <ArrowLeftOnRectangleIcon
              className="w-5 h-5 inline rtl:md:ml-1 ltr:md:mr-1"
              aria-hidden="true"
            />
          }
        >
          <span className="hidden md:inline relative top-0.5 text-sm ">
            {t("title")}
          </span>
        </Button>
      </Link>
    );
  }

  return (
    <Menu as="div" className="relative top-0.5 inline-block ltr:ml-2 rtl:mr-2">
      <Menu.Button as={Fragment}>
        <div
          className={`cursor-pointer flex justify-center items-center ${SHADOW} w-8 h-8 rounded-full truncate`}
        >
          {status === "authenticated" ? (
            <img
              src={session?.user?.image!}
              alt={session?.user?.name!}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <Loading size="large" />
          )}
        </div>
      </Menu.Button>

      {status === "authenticated" && (
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
            className={`ltr:origin-top-right rtl:origin-top-left absolute z-100 ltr:right-0 rtl:left-0 mt-2 w-56 ${BG_TRANSPARENT_BACKDROP} ${SHADOW} ${PADDING} ${ROUNDED} `}
          >
            <Menu.Item>
              <Link href={"/account"}>
                <Button
                  icon={
                    <Cog6ToothIcon
                      className="inline h-5 w-5 mx-2"
                      aria-hidden="true"
                    />
                  }
                  variant="outline"
                >
                  {t("account")}
                </Button>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href={"/account/wishlist"}>
                <Button
                  icon={
                    <HeartIcon
                      className="inline h-5 w-5 mx-2"
                      aria-hidden="true"
                    />
                  }
                  variant="outline"
                >
                  {t("wishlist")}
                </Button>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href={"/account/orders"}>
                <Button
                  icon={
                    <Square3Stack3DIcon
                      className="inline h-5 w-5 mx-2"
                      aria-hidden="true"
                    />
                  }
                  variant="outline"
                >
                  {t("orders")}
                </Button>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <div>
                <Button
                  icon={
                    <PowerIcon
                      className="inline h-5 w-5 mx-2"
                      aria-hidden="true"
                    />
                  }
                  onClick={() => signOut()}
                  variant="outline"
                >
                  {t("signOut")}
                </Button>
              </div>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      )}
    </Menu>
  );
};

export default AccountBadge;
