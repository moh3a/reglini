import Button from "@components/shared/Button";
import Loading from "@components/shared/Loading";
import { TEXT_GRADIENT } from "@config/design";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { trpc } from "@utils/trpc";
import { useEffect } from "react";

interface OrderDetailsProps {
  id: string;
}

const OrderDetails = ({ id }: OrderDetailsProps) => {
  const orderQuery = trpc.order.get.useQuery({ order_id: id });
  const shippingAddress = trpc.order.address.useQuery({ order_id: id });
  const trackingMutation = trpc.aliexpress.ds.tracking.useMutation();

  useEffect(() => {
    if (
      orderQuery &&
      orderQuery.data &&
      orderQuery.data.result &&
      orderQuery.data.result.logistics_info_list
    ) {
      trackingMutation.mutate({
        order_id: id,
        tracking_id: orderQuery.data.result.logistics_info_list[0].logistics_no,
        service_name:
          orderQuery.data.result.logistics_info_list[0].logistics_service,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, orderQuery.data]);

  return (
    <div className="px-4 mx-auto max-w-xl">
      {orderQuery.isLoading && (
        <div className="w-full flex justify-center items-center">
          <Loading size="medium" />
        </div>
      )}
      {orderQuery.data && orderQuery.data.result && (
        <div>
          <div>
            <h2 className="mt-2">
              <span
                className={`font-semibold text-xl font-mono ${TEXT_GRADIENT} `}
              >
                Order info
              </span>
            </h2>
            <div className="leading-tight">
              <div>Order ID: {id}</div>
              <div>
                Order Status:{" "}
                {orderQuery.data.result.order_status.split("_").join(" ")}
              </div>
              <div>
                Logistics Status:{" "}
                {orderQuery.data.result.logistics_status.split("_").join(" ")}
              </div>
            </div>
          </div>
          <div>
            <h2 className="mt-2">
              <span
                className={`font-semibold text-xl font-mono ${TEXT_GRADIENT} `}
              >
                Product info
              </span>
            </h2>
            <div>
              Product ID:{" "}
              {orderQuery.data.result.child_order_list[0].product_id}
            </div>
          </div>
          <>
            <h2 className="mt-2">
              <span
                className={`font-semibold text-xl font-mono ${TEXT_GRADIENT} `}
              >
                Address info
              </span>
            </h2>
            <section>
              {shippingAddress.isLoading && (
                <div className="w-full flex justify-center items-center">
                  <Loading size="medium" />
                </div>
              )}
              {shippingAddress.data && shippingAddress.data.address && (
                <div className="flex">
                  <div className="flex justify-center items-center w-20">
                    <MapPinIcon
                      className="w-5 h-5 text-aliexpress"
                      aria-hidden="true"
                    />{" "}
                  </div>
                  <div className="text-gray-500 font-mono leading-none">
                    <p className="font-bold">
                      {shippingAddress.data.address.name}
                    </p>
                    <p>{shippingAddress.data.address.mobilePhone}</p>
                    <p>{shippingAddress.data.address.addressLine1}</p>
                    <p>
                      {shippingAddress.data.address.city} -{" "}
                      {shippingAddress.data.address.province}, DZ,{" "}
                      {shippingAddress.data.address.zipCode}
                    </p>
                  </div>
                </div>
              )}
            </section>
          </>
          <div className="mt-2 flex justify-end space-x-2">
            {orderQuery.data.result.order_status === "PLACE_ORDER_SUCCESS" && (
              <Button variant="solid">Cancel order</Button>
            )}
            {orderQuery.data.result.order_status === "PLACE_ORDER_SUCCESS" && (
              <Button variant="solid">Pay</Button>
            )}
            {orderQuery.data.result.logistics_status !== "NO_LOGISTICS" &&
              orderQuery.data.result.order_status !== "FINISH" && (
                <Button variant="solid">Track order</Button>
              )}
            {orderQuery.data.result.order_status ===
              "WAIT_BUYER_ACCEPT_GOODS" && (
              <Button variant="solid">Confirm receipt</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
