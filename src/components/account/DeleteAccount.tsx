import { type FormEvent, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HomeIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";

import {
  BG_TRANSPARENT_BACKDROP,
  PADDING,
  ROUNDED,
  SHADOW,
} from "~/config/design";
import { Button, Title } from "~/components/shared";
import { api } from "~/utils/api";

const DeleteAccount = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const deleteMutation = api.account.delete.useMutation();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const deleteAccountHandler = (e: FormEvent): void => {
    e.preventDefault();
    deleteMutation.mutate(undefined, {
      onSettled() {
        void signOut();
        void router.push(`/auth/login?error=account_deleted`);
      },
    });
  };
  const t = useTranslations("AccountPage.delete");

  return (
    <>
      <div className="mx-8 my-60 text-center lg:mx-32">
        <p className="mb-4 text-center font-mono text-xl font-bold">
          {t("prompt")}
        </p>
        <Button
          onClick={openModal}
          variant="outline"
          icon={
            <TrashIcon className="mr-1 inline h-5 w-5" aria-hidden="true" />
          }
        >
          {t("delete")}
        </Button>
        <br />
        <Link href={"/"}>
          <Button
            variant="outline"
            icon={
              <HomeIcon className="mr-1 inline h-5 w-5" aria-hidden="true" />
            }
          >
            {t("goHome")}
          </Button>
        </Link>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className={`my-8 inline-block w-full max-w-xl transform overflow-hidden p-6 text-center align-middle transition-all ${BG_TRANSPARENT_BACKDROP} ${SHADOW} ${PADDING} ${ROUNDED}`}
              >
                <form onSubmit={deleteAccountHandler} className="py-5">
                  <Dialog.Title as="h2">
                    <Title center={true} title="DELETE YOUR ACCOUNT" />
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm">{t("dataLoss")}</p>
                  </div>

                  <div className="mt-2">
                    <Button
                      onClick={closeModal}
                      variant="solid"
                      icon={
                        <TrashIcon
                          className="mr-1 inline h-5 w-5"
                          aria-hidden="true"
                        />
                      }
                    >
                      {t("permanentlyDelete")}
                    </Button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default DeleteAccount;
