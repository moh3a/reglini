import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, ReactNode, SetStateAction } from "react";

interface ModalProps {
  type?: "error" | "warning" | "success";
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  title?: string;
  transparent?: boolean;
}

export default function Modal({
  type,
  isOpen,
  setIsOpen,
  children,
  title,
  transparent,
}: ModalProps) {
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full max-w-md lg:max-w-6xl transform rounded-2xl ${
                  !type && "bg-white dark:bg-grim"
                } ${type === "error" && "text-white bg-danger"} ${
                  type === "warning" && "text-white bg-warning"
                } ${type === "success" && "text-white bg-success"} ${
                  transparent
                    ? "bg-opacity-50 backdrop-blur-sm"
                    : "bg-opacity-95"
                } p-6 align-middle shadow-xl transition-all`}
              >
                <Dialog.Title as="h3" className="text-lg leading-6">
                  {title}
                </Dialog.Title>

                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
