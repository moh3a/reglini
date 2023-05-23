import { FormEvent, Fragment, useState } from "react";
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
} from "@config/design";
import Button from "@components/shared/Button";
import Title from "@components/shared/Title";
import { trpc } from "@utils/trpc";

const DeleteAccount = () => {
  let [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const deleteMutation = trpc.account.delete.useMutation();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const deleteAccountHandler = async (e: FormEvent) => {
    e.preventDefault();
    await deleteMutation.mutateAsync(undefined, {
      onSettled(data) {
        signOut();
        router.push(`/auth/login?error=account_deleted`);
      },
    });
  };
  const t = useTranslations("AccountPage.delete");

  return (
    <>
      <div className="text-center mx-8 lg:mx-32 my-60">
        <p className="mb-4 font-bold font-mono text-xl text-center">
          {t("prompt")}
        </p>
        <Button
          onClick={openModal}
          variant="outline"
          icon={
            <TrashIcon className="h-5 w-5 mr-1 inline" aria-hidden="true" />
          }
        >
          {t("delete")}
        </Button>
        <br />
        <Link href={"/"}>
          <Button
            variant="outline"
            icon={
              <HomeIcon className="h-5 w-5 mr-1 inline" aria-hidden="true" />
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
                className={`inline-block w-full max-w-xl p-6 my-8 overflow-hidden text-center align-middle transition-all transform ${BG_TRANSPARENT_BACKDROP} ${SHADOW} ${PADDING} ${ROUNDED}`}
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
                          className="h-5 w-5 mr-1 inline"
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
