import { Fragment, useState } from "react";
import { useSession } from "next-auth/react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

import CartItem from "./CartItem";
import Button from "@components/shared/Button";
import Loading from "@components/shared/Loading";
import { trpc } from "@utils/trpc";
import { AENOProduct } from "@reglini-types/index";

export default function Cart() {
  const t = useTranslations("Common.cart");
  const router = useRouter();

  const [openCart, setOpenCart] = useState(false);
  const { status } = useSession();
  const [subtotal, setSubtotal] = useState(0);

  const cartQuery = trpc.cart.get.useQuery(undefined, {
    onSettled(data) {
      if (data && data.cart) {
        let subs = 0;
        data.cart.forEach((item) => {
          if (item.price) subs += item.price * (item.quantity ?? 1);
        });
        setSubtotal(subs);
      }
    },
  });

  const placeOrderHandler = () => {
    if (subtotal > 0) {
      const products = cartQuery.data?.cart?.map((product) => ({
        productId: product.productId,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        imageUrl: product.imageUrl,
        properties: product.properties,
        quantity: product.quantity,
        sku: product.sku,
        carrierId: product.carrierId,
        shippingPrice: product.shippingPrice,
        totalPrice: product.totalPrice,
      }));
      localStorage.setItem("aeno", JSON.stringify(products));
      router.push("/account/orders/new?ref=cart");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpenCart(true)}
        icon={<ShoppingBagIcon className="h-5 w-5 inline" aria-hidden="true" />}
      >
        <span className="sr-only">items in cart, view bag</span>
        <span className="absolute text-xs w-5 h-5 p-0.5 rounded-full bg-aliexpress text-white top-0 right-0">
          {cartQuery.data && cartQuery.data?.cart
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
              <Dialog.Overlay className="absolute inset-0 transition-opacity bg-opacity-50 backdrop-blur-md" />
            </Transition.Child>

            <div className="fixed inset-y-0 ltr:right-0 rtl:left-0  ltr:pl-10 rtl:pr-10 max-w-full flex">
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
                    className={`h-full flex flex-col bg-white dark:bg-grim shadow-xl overflow-y-scroll`}
                  >
                    <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className={`text-lg font-mono`}>
                          {t("title")}
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
                            {status === "authenticated" ? (
                              cartQuery.data &&
                              cartQuery.data.cart &&
                              cartQuery.data.cart.length > 0 ? (
                                cartQuery.data.cart.map((item) => (
                                  <CartItem
                                    key={item.id}
                                    item={item as AENOProduct}
                                  />
                                ))
                              ) : (
                                <li className={`py-6 flex`}>{t("empty")}</li>
                              )
                            ) : (
                              <li className="py-6 flex">You are offline!</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div
                        className={`flex justify-between text-base font-medium font-mono`}
                      >
                        <p>{t("subtotal")}</p>
                        <p>{t("price", { price: subtotal })}</p>
                      </div>
                      <p
                        className={`mt-0.5 mb-5 text-sm font-mono text-center`}
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
                      <div className="mt-6 flex justify-center text-sm text-center text-gray-800 dark:text-gray-100">
                        <p>
                          {t("or")}{" "}
                          <button
                            type="button"
                            className="text-gray-600 dark:text-gray-200 font-medium hover:text-gray-500 dark:hover:text-gray-300"
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
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
