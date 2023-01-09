/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  CheckCircleIcon,
  MapPinIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { PADDING, ROUNDED, SHADOW, TEXT_GRADIENT } from "@config/design";
import Button from "@components/shared/Button";
import Loading from "@components/shared/Loading";
import { trpc } from "@utils/trpc";
import { useState } from "react";
import Modal from "@components/shared/Modal";
import Title from "@components/shared/Title";

interface OrderDetailsProps {
  id: string;
}

const OrderDetails = ({ id }: OrderDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [info, setInfo] = useState<"tracking" | "payment" | undefined>();
  const orderQuery = trpc.order.get.useQuery({ order_id: id });
  const detailsQuery = trpc.order.details.useQuery({ order_id: id });
  const trackingMutation = trpc.aliexpress.ds.tracking.useMutation();

  const getTracking = async () => {
    if (
      orderQuery &&
      orderQuery.data &&
      orderQuery.data.result &&
      orderQuery.data.result.logistics_info_list
    ) {
      setInfo("tracking");
      setIsOpen(true);
      await trackingMutation.mutateAsync({
        order_id: id,
        tracking_id: orderQuery.data.result.logistics_info_list[0].logistics_no,
        service_name:
          orderQuery.data.result.logistics_info_list[0].logistics_service,
      });
    }
  };

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
            <dl className={`m-auto truncate ${PADDING} ${SHADOW} ${ROUNDED} `}>
              <div className="p-2 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-bold lg:flex lg:items-center">
                  Order Id
                </dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">{id}</dd>
              </div>
              <div className="p-2 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-bold lg:flex lg:items-center">
                  Order date
                </dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  {orderQuery.data.result.gmt_create}
                </dd>
              </div>
              <div className="p-2 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-bold lg:flex lg:items-center">
                  Order status
                </dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  <span className={"text-aliexpress font-bold uppercase"}>
                    {orderQuery.data.result.order_status ===
                      "PLACE_ORDER_SUCCESS" &&
                      orderQuery.data.result.logistics_status ===
                        "NO_LOGISTICS" &&
                      "Awaiting Payment"}
                    {orderQuery.data.result.order_status ===
                      "PLACE_ORDER_SUCCESS" &&
                      orderQuery.data.result.logistics_status ===
                        "WAIT_SELLER_SEND_GOODS" &&
                      "Awaiting Shipment"}
                    {orderQuery.data.result.order_status ===
                      "WAIT_BUYER_ACCEPT_GOODS" &&
                      orderQuery.data.result.logistics_status ===
                        "SELLER_SEND_GOODS" &&
                      "Awaiting Reception confirmation"}
                    {orderQuery.data.result.order_status === "FINISH" &&
                      "Finished"}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
          {detailsQuery.isLoading && (
            <div className="w-full flex justify-center items-center">
              <Loading size="medium" />
            </div>
          )}
          {detailsQuery.data &&
            detailsQuery.data.order &&
            detailsQuery.data.order.payment &&
            (detailsQuery.data.order.payment.isPaymentConfirmed ||
              detailsQuery.data.order.payment.wasDeclined) && (
              <>
                <h2 className="mt-2">
                  <span
                    className={`font-semibold text-xl font-mono ${TEXT_GRADIENT} `}
                  >
                    Payment info
                  </span>
                </h2>
                <dl
                  className={`m-auto truncate ${PADDING} ${SHADOW} ${ROUNDED} `}
                >
                  <div className="p-2 sm:px-4 sm:py-5 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-bold lg:flex lg:items-center">
                      Payment confirmed?
                    </dt>
                    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                      {detailsQuery.data.order.payment.isPaymentConfirmed ? (
                        <CheckCircleIcon
                          className="h-6 w-6 inline text-success"
                          aria-checked="true"
                        />
                      ) : (
                        <XMarkIcon
                          className="h-6 w-6 inline text-danger"
                          aria-checked="true"
                        />
                      )}
                    </dd>
                  </div>
                  <div className="p-2 sm:px-4 sm:py-5 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-bold lg:flex lg:items-center">
                      Payment declined?
                    </dt>
                    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                      {detailsQuery.data.order.payment.wasDeclined ? (
                        <CheckCircleIcon
                          className="h-6 w-6 inline text-success"
                          aria-checked="true"
                        />
                      ) : (
                        <XMarkIcon
                          className="h-6 w-6 inline text-danger"
                          aria-checked="true"
                        />
                      )}
                    </dd>
                  </div>
                  <div className="p-2 sm:px-4 sm:py-5 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-bold lg:flex lg:items-center">
                      Payment receipt
                    </dt>
                    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                      <Link
                        href={detailsQuery.data.order.payment.receipt ?? ""}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <PhotoIcon
                          className="h-6 w-6 inline text-success"
                          aria-checked="true"
                        />
                      </Link>
                    </dd>
                  </div>
                </dl>
              </>
            )}
          {detailsQuery.data &&
            detailsQuery.data.order &&
            detailsQuery.data.order.product && (
              <>
                <h2 className="mt-2">
                  <span
                    className={`font-semibold text-xl font-mono ${TEXT_GRADIENT} `}
                  >
                    Product info
                  </span>
                </h2>
                <Link
                  href={`/aliexpress/product/${detailsQuery.data.order.product.productId}`}
                  target={"_blank"}
                >
                  <dl
                    className={`m-auto truncate ${PADDING} ${SHADOW} ${ROUNDED} p-2 sm:px-4 sm:py-5 grid grid-cols-5 gap-4`}
                  >
                    <dt className="flex justify-center items-center">
                      <img
                        src={detailsQuery.data.order.product.imageUrl}
                        alt={detailsQuery.data.order.product.productId}
                        className={` ${ROUNDED} w-20`}
                      />
                    </dt>
                    <dd className="text-sm col-span-4">
                      <p className="font-bold">
                        Product ID: {detailsQuery.data.order.product.productId}
                      </p>
                      <p className="h-5 overflow-hidden text-ellipsis">
                        {detailsQuery.data.order.product.name}
                      </p>
                      <p className="font-mono text-aliexpress">
                        {detailsQuery.data.order.product.totalPrice} DZD
                      </p>
                    </dd>
                  </dl>
                </Link>
              </>
            )}
          {detailsQuery.data &&
            detailsQuery.data.order &&
            detailsQuery.data.order.shippingAddress && (
              <>
                <h2 className="mt-2">
                  <span
                    className={`font-semibold text-xl font-mono ${TEXT_GRADIENT} `}
                  >
                    Address info
                  </span>
                </h2>
                <section>
                  <div className="flex">
                    <div className="flex justify-center items-center w-20">
                      <MapPinIcon
                        className="w-5 h-5 text-aliexpress"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="pl-2 font-mono leading-none">
                      <p className="font-bold">
                        {detailsQuery.data.order.shippingAddress.name}
                      </p>
                      <p>
                        {detailsQuery.data.order.shippingAddress.mobilePhone}
                      </p>
                      <p>
                        {detailsQuery.data.order.shippingAddress.addressLine1}
                      </p>
                      <p>
                        {detailsQuery.data.order.shippingAddress.city} -{" "}
                        {detailsQuery.data.order.shippingAddress.province}, DZ,{" "}
                        {detailsQuery.data.order.shippingAddress.zipCode}
                      </p>
                    </div>
                  </div>
                </section>
              </>
            )}
          <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={info?.toUpperCase()}
          >
            <Title title="todo" />
          </Modal>
          <div className="mt-4 flex justify-end space-x-2">
            {orderQuery.data.result.order_status === "PLACE_ORDER_SUCCESS" && (
              <Button variant="solid">Cancel order</Button>
            )}
            {orderQuery.data.result.order_status === "PLACE_ORDER_SUCCESS" &&
              !detailsQuery.data?.order?.payment?.isPaymentConfirmed && (
                <Button
                  variant="solid"
                  onClick={() => {
                    setInfo("payment");
                    setIsOpen(true);
                  }}
                >
                  Pay
                </Button>
              )}
            {orderQuery.data.result.logistics_status !== "NO_LOGISTICS" &&
              orderQuery.data.result.order_status !== "FINISH" && (
                <Button variant="solid" onClick={getTracking}>
                  Track order
                </Button>
              )}
            {orderQuery.data.result.order_status ===
              "WAIT_BUYER_ACCEPT_GOODS" &&
              !detailsQuery.data?.order?.received?.wasReceived && (
                <Button variant="solid">Confirm receipt</Button>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
