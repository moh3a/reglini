import { Fragment, useState } from "react";
import { useSession } from "next-auth/react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

import { Button } from "~/components/shared";
import Items from "~/components/account/cart/Items";
import type { Prisma } from "@prisma/client";
import { NEW_ORDER_LOCAL_STORAGE_NAME } from "~/config/constants";

export type CartItems =
  | {
      productId: string;
      name: string;
      price: number;
      originalPrice: number | null;
      imageUrl: string;
      properties: Prisma.JsonValue;
      quantity: number | null;
      sku: string | null;
      carrierId: string | null;
      shippingPrice: number | null;
      totalPrice: number | null;
    }[]
  | undefined;

export default function Cart() {
  const t = useTranslations("Common.cart");
  const router = useRouter();

  const { status } = useSession();
  const [openCart, setOpenCart] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [itemsCount, setItemsCount] = useState(0);
  const [products, setProducts] = useState<CartItems>(undefined);

  const placeOrderHandler = () => {
    if (subtotal > 0 && products?.length && products?.length > 0) {
      localStorage.setItem(
        NEW_ORDER_LOCAL_STORAGE_NAME,
        JSON.stringify(products),
      );
      void router.push("/account/orders/new?ref=cart");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpenCart(true)}
        icon={<ShoppingBagIcon className="inline h-5 w-5" aria-hidden="true" />}
      >
        <span className="sr-only">items in cart, view bag</span>
        <span className="absolute right-0 top-0 h-5 w-5 rounded-full bg-aliexpress p-0.5 text-xs text-white">
          {status !== "authenticated" ? 0 : itemsCount}
        </span>
      </Button>

      <Transition.Root show={openCart} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-100 overflow-hidden"
          onClose={setOpenCart}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="absolute inset-0 bg-opacity-50 backdrop-blur-md transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-y-0 flex max-w-full  ltr:right-0 ltr:pl-10 rtl:left-0 rtl:pr-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="ltr:translate-x-full rtl:-translate-x-full"
                enterTo="ltr:translate-x-0 rtl:-translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="ltr:translate-x-0 rtl:-translate-x-0"
                leaveTo="ltr:translate-x-full rtl:-translate-x-full"
              >
                <div className="w-screen max-w-md">
                  <div
                    className={`flex h-full flex-col overflow-y-scroll bg-white shadow-xl dark:bg-grim`}
                  >
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className={`font-mono text-lg`}>
                          {t("title")}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <Button
                            onClick={() => setOpenCart(false)}
                            variant="outline"
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {status === "authenticated" ? (
                              <Items
                                setProducts={setProducts}
                                setItemsCount={setItemsCount}
                                setSubtotal={setSubtotal}
                              />
                            ) : (
                              <li className="flex py-6">You are offline!</li>
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div
                          className={`flex justify-between font-mono text-base font-medium`}
                        >
                          <p>{t("subtotal")}</p>
                          <p>{t("price", { price: subtotal })}</p>
                        </div>
                        <p
                          className={`mb-5 mt-0.5 text-center font-mono text-sm`}
                        >
                          {t("atCheckout")}
                        </p>
                        <Button
                          width="100%"
                          variant="solid"
                          onClick={() => {
                            setOpenCart(false);
                            placeOrderHandler();
                          }}
                        >
                          {t("placeOrder")}
                        </Button>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-800 dark:text-gray-100">
                          <p>
                            {t("or")}{" "}
                            <button
                              type="button"
                              className="font-medium text-gray-600 hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-300"
                              onClick={() => setOpenCart(false)}
                            >
                              {t("continueShopping")}
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
