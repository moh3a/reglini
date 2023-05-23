/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useTranslations } from "next-intl";

import { PADDING, ROUNDED, SHADOW } from "@config/design";
import Loading from "@components/shared/Loading";
import Title from "@components/shared/Title";
import { trpc } from "@utils/trpc";

const ListOrders = () => {
  const ordersQuery = trpc.order.all.useQuery();
  const t = useTranslations("AccountPage.orders");

  return (
    <div className="mx-auto max-w-xl">
      <Title center={true} title={t("title")} />
      <div className="px-3 my-4 space-y-4 lg:space-y-8">
        {ordersQuery.isLoading && (
          <div className="w-full flex justify-center items-center">
            <Loading size="medium" />
          </div>
        )}
        {ordersQuery.data &&
        ordersQuery.data.orders &&
        ordersQuery.data.orders.length > 0 ? (
          ordersQuery.data.orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`}>
              <dl
                className={`m-auto truncate ${PADDING} ${SHADOW} ${ROUNDED} my-10 p-2 sm:px-4 sm:py-5`}
              >
                <div className="font-bold">
                  {t("orderId")}: {order.id}
                </div>
                {order.products &&
                  order.products.map((product) => (
                    <div
                      key={product.id}
                      className={`border-b my-4 p-2 sm:px-4 sm:py-5 grid grid-cols-5 gap-4`}
                    >
                      <dt className="flex justify-center items-center">
                        <img
                          src={product.imageUrl}
                          alt={product.productId}
                          className={` ${ROUNDED} w-20`}
                        />
                      </dt>
                      <dd className="text-sm col-span-4">
                        <p className="h-5 overflow-hidden text-ellipsis">
                          {product.name}
                        </p>
                        <p className="font-mono text-aliexpress">
                          {t("price", { price: product.totalPrice })}
                        </p>
                      </dd>
                    </div>
                  ))}

                <div>
                  {!order.cancelled && order.payment?.receipt && (
                    <p className="text-success font-bold uppercase">
                      {t("status.paid")}
                    </p>
                  )}
                  {!order.cancelled && !order.payment?.receipt && (
                    <p className="text-warning font-bold uppercase">
                      {t("status.awaiting")}
                    </p>
                  )}
                  {order.cancelled && (
                    <p className="text-danger font-bold uppercase">
                      {t("status.cancelled")}
                    </p>
                  )}
                </div>
              </dl>
            </Link>
          ))
        ) : (
          <div className="font-mono text-center">{t("empty")}</div>
        )}
      </div>
    </div>
  );
};

export default ListOrders;
