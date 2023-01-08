import Loading from "@components/shared/Loading";
import Title from "@components/shared/Title";
import { PADDING, ROUNDED, SHADOW } from "@config/design";
import { trpc } from "@utils/trpc";
import Link from "next/link";

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
            <div key={order.id} className={` ${SHADOW} ${PADDING} ${ROUNDED}`}>
              <Link href={`/account/orders/${order.id}`}>{order.id}</Link>
            </div>
          ))
        ) : (
          <div className="font-mono text-center">You have no orders.</div>
        )}
      </div>
    </div>
  );
};

export default ListOrders;
