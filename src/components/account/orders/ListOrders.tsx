/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { PADDING, ROUNDED, SHADOW } from "@config/design";
import Loading from "@components/shared/Loading";
import Title from "@components/shared/Title";
import { trpc } from "@utils/trpc";

const ListOrders = () => {
  const ordersQuery = trpc.order.all.useQuery();
  return (
    <div className="mx-auto max-w-xl">
      <Title title="Your orders" />
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
                className={`m-auto truncate ${PADDING} ${SHADOW} ${ROUNDED} p-2 sm:px-4 sm:py-5 grid grid-cols-5 gap-4`}
              >
                <dt className="flex justify-center items-center">
                  <img
                    src={order.product?.imageUrl}
                    alt={order.product?.productId}
                    className={` ${ROUNDED} w-20`}
                  />
                </dt>
                <dd className="text-sm col-span-4">
                  <p className="font-bold">Order ID: {order.id}</p>
                  <p className="h-5 overflow-hidden text-ellipsis">
                    {order.product?.name}
                  </p>
                  <p className="font-mono text-aliexpress">
                    {order.product?.totalPrice} DZD
                  </p>
                  {!order.cancelled && order.payment?.receipt && (
                    <p className="text-success font-bold uppercase">
                      ORDER PAID
                    </p>
                  )}
                  {!order.cancelled && !order.payment?.receipt && (
                    <p className="text-warning font-bold uppercase">
                      AWAITING PAYMENT
                    </p>
                  )}
                  {order.cancelled && (
                    <p className="text-danger font-bold uppercase">
                      ORDER CANCELLED
                    </p>
                  )}
                </dd>
              </dl>
            </Link>
          ))
        ) : (
          <div className="font-mono text-center">You have no orders.</div>
        )}
      </div>
    </div>
  );
};

export default ListOrders;
