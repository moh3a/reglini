import { Fragment, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";

import CartItem from "./CartItem";
import Button from "@components/shared/Button";
import Loading from "@components/shared/Loading";
import { trpc } from "@utils/trpc";

export default function Cart() {
  const [openCart, setOpenCart] = useState(false);
  const { status } = useSession();
  const [subtotal, setSubtotal] = useState(0);

  const cartQuery = trpc.cart.get.useQuery(undefined, {
    onSettled(data) {
      if (data && data.cart) {
        let subs = 0;
        data.cart.forEach((item) => {
          if (item.totalPrice) subs += item.totalPrice * (item.quantity ?? 1);
        });
        setSubtotal(subs);
      }
    },
  });

  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          if (status === "authenticated") setOpenCart(true);
        }}
      >
        <span className="sr-only">items in cart, view bag</span>
        <ShoppingBagIcon className="h-5 w-5 inline" aria-hidden="true" />
        <span className="absolute text-xs w-5 h-5 p-0.5 rounded-full bg-aliexpress text-white top-0 right-0">
          {(status === "loading" || cartQuery.isLoading) && (
            <Loading size="small" />
          )}
          {status === "authenticated" && cartQuery.data && cartQuery.data?.cart
            ? cartQuery.data?.cart.length
            : 0}
        </span>
      </Button>

      <Transition.Root show={openCart} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-100 inset-0 overflow-hidden"
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
              <Dialog.Overlay className="absolute inset-0 bg-gray-500 dark:bg-black dark:bg-opacity-80 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="w-screen max-w-md">
                  <div
                    className={`h-full flex flex-col bg-white dark:bg-grim shadow-xl overflow-y-scroll`}
                  >
                    <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className={`text-lg font-mono`}>
                          Shopping cart
                        </Dialog.Title>
                        <div className="ml-3 h-7 flex items-center">
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
                            {cartQuery.isLoading && (
                              <div className="w-full flex justify-center items-center">
                                <Loading size="medium" />
                              </div>
                            )}
                            {cartQuery.data &&
                            cartQuery.data.cart &&
                            cartQuery.data.cart.length > 0 ? (
                              cartQuery.data.cart.map((item) => (
                                <CartItem key={item.id} item={item} />
                              ))
                            ) : (
                              <li className={`py-6 flex`}>
                                Your cart is empty.
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div
                        className={`flex justify-between text-base font-medium font-mono`}
                      >
                        <p>Subtotal</p>
                        <p>{subtotal} DZD</p>
                      </div>
                      <p
                        className={`mt-0.5 mb-5 text-sm font-mono text-center`}
                      >
                        Shipping and total calculated at checkout.
                      </p>
                      <Link href="/account/orders/new?ref=cart" passHref>
                        <Button
                          width="100%"
                          variant="solid"
                          onClick={() => setOpenCart(false)}
                        >
                          Place Order
                        </Button>
                      </Link>
                      <div className="mt-6 flex justify-center text-sm text-center text-gray-800 dark:text-gray-100">
                        <p>
                          or{" "}
                          <button
                            type="button"
                            className="text-gray-600 dark:text-gray-200 font-medium hover:text-gray-500 dark:hover:text-gray-300"
                            onClick={() => setOpenCart(false)}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
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
