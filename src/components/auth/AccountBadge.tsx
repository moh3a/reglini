/* eslint-disable @next/next/no-img-element */
import React, { Fragment } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import {
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";
import Button from "../shared/Button";
import { PADDING, ROUNDED, SHADOW } from "@config/design";
import Loading from "@components/shared/Loading";
import { HeartIcon } from "@heroicons/react/24/solid";

const AccountBadge = () => {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    return (
      <div>
        <Link href={"/auth/login"}>
          <Button
            variant="outline"
            icon={
              <ArrowLeftOnRectangleIcon
                className="inline w-5 h-5 mr-1"
                aria-hidden="true"
              />
            }
          >
            Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as={Fragment}>
        <div
          className={`cursor-pointer flex justify-center items-center ${SHADOW} w-10 h-10 rounded-full truncate`}
        >
          {status === "authenticated" ? (
            <img
              src={session.user?.image!}
              alt={session.user?.name!}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <Loading size="large" />
          )}
        </div>
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
          className={`origin-top-right absolute right-0 mt-2 w-56 backdrop-blur-md bg-black/5 dark:bg-black/50 ${SHADOW} ${PADDING} ${ROUNDED} `}
        >
          <Menu.Item>
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
                Account
              </Button>
            </Link>
          </Menu.Item>
          <Menu.Item>
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
                Wishlist
              </Button>
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Button
              icon={
                <PowerIcon className="inline h-5 w-5 mr-2" aria-hidden="true" />
              }
              onClick={() => signOut()}
              variant="outline"
            >
              Sign out
            </Button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default AccountBadge;
