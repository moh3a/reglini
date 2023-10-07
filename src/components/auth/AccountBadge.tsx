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
} from "~/config/design";
import { Button, Loading } from "~/components/shared";

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
              className="inline h-5 w-5 ltr:md:mr-1 rtl:md:ml-1"
              aria-hidden="true"
            />
          }
        >
          <span className="relative top-0.5 hidden text-sm md:inline ">
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
          className={`flex cursor-pointer items-center justify-center ${SHADOW} h-8 w-8 truncate rounded-full`}
        >
          {status === "authenticated" ? (
            <img
              src={session?.user?.image as string | undefined}
              alt={session?.user?.name as string | undefined}
              className="h-8 w-8 rounded-full"
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
            className={`absolute z-100 mt-2 w-56 ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left ${BG_TRANSPARENT_BACKDROP} ${SHADOW} ${PADDING} ${ROUNDED} `}
          >
            <Menu.Item>
              <Link href={"/account"}>
                <Button
                  icon={
                    <Cog6ToothIcon
                      className="mx-2 inline h-5 w-5"
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
                      className="mx-2 inline h-5 w-5"
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
                      className="mx-2 inline h-5 w-5"
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
                      className="mx-2 inline h-5 w-5"
                      aria-hidden="true"
                    />
                  }
                  onClick={() => void signOut()}
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
