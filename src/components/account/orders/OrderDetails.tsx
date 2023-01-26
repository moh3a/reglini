/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { MapPinIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { PADDING, ROUNDED, SHADOW, TEXT_GRADIENT } from "@config/design";
import Button from "@components/shared/Button";
import Loading from "@components/shared/Loading";
import Modal from "@components/shared/Modal";
import Banner from "@components/shared/Banner";
import Pay from "./actions/Pay";
import Cancel from "./actions/Cancel";
import Tracking from "./actions/Tracking";
import { trpc } from "@utils/trpc";
import ConfirmReception from "./actions/ConfirmReception";
import { IMessage } from "@reglini-types/index";

interface OrderDetailsProps {
  id: string;
}

const OrderDetails = ({ id }: OrderDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [info, setInfo] = useState<
    "tracking" | "payment" | "confirm_cancel" | "confirm_receipt" | undefined
  >();
  const [message, setMessage] = useState<IMessage>();

  const orderQuery = trpc.order.get.useQuery({ order_id: id });
  const detailsQuery = trpc.order.details.useQuery({ order_id: id });

  const cancelOrderHandler = async () => {
    if (orderQuery.data?.result?.order_status === "PLACE_ORDER_SUCCESS") {
      setInfo("confirm_cancel");
      setIsOpen(true);
    }
  };

  const paymentHandler = async () => {
    if (
      orderQuery.data?.result?.order_status === "PLACE_ORDER_SUCCESS" &&
      !detailsQuery.data?.order?.payment?.receipt
    ) {
      setInfo("payment");
      setIsOpen(true);
    }
  };

  const getTracking = async () => {
    if (
      orderQuery &&
      orderQuery.data &&
      orderQuery.data.result &&
      orderQuery.data.result.logistics_info_list
    ) {
      setInfo("tracking");
      setIsOpen(true);
    }
  };

  const confirmReceptionHandler = async () => {
    if (
      orderQuery.data?.result?.order_status === "WAIT_BUYER_ACCEPT_GOODS" &&
      !detailsQuery.data?.order?.received?.wasReceived
    ) {
      setInfo("confirm_receipt");
      setIsOpen(true);
    }
  };
  const t = useTranslations("AccountPage.orders");

  return (
    <div className="px-4 mx-auto max-w-xl">
      {orderQuery.isLoading && (
        <div className="w-full flex justify-center items-center">
          <Loading size="medium" />
        </div>
      )}
      {message?.type && <Banner type={message?.type} message={message?.text} />}
      {orderQuery.data && orderQuery.data.result && (
        <div>
          <div>
            <h2 className="mt-2">
              <span
                className={`font-semibold text-xl font-mono ${TEXT_GRADIENT} `}
              >
                {t("orderInfo")}
              </span>
            </h2>
            <dl className={`m-auto truncate ${PADDING} ${SHADOW} ${ROUNDED} `}>
              <div className="p-2 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-bold lg:flex lg:items-center">
                  {t("orderId")}
                </dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">{id}</dd>
              </div>
              <div className="p-2 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-bold lg:flex lg:items-center">
                  {t("orderDate")}
                </dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  {orderQuery.data.result.gmt_create}
                </dd>
              </div>
              <div className="p-2 sm:px-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-bold lg:flex lg:items-center">
                  {t("orderStatus.title")}
                </dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  <span className={"text-aliexpress font-bold uppercase"}>
                    {orderQuery.data.result.order_status ===
                      "PLACE_ORDER_SUCCESS" &&
                      orderQuery.data.result.logistics_status ===
                        "NO_LOGISTICS" &&
                      !detailsQuery.data?.order?.payment?.receipt &&
                      t("orderStatus.awaitingPayment")}
                    {orderQuery.data.result.order_status ===
                      "PLACE_ORDER_SUCCESS" &&
                      orderQuery.data.result.logistics_status ===
                        "NO_LOGISTICS" &&
                      detailsQuery.data?.order?.payment?.receipt &&
                      t("orderStatus.awaitingPaymentConfirmation")}
                    {orderQuery.data.result.order_status ===
                      "PLACE_ORDER_SUCCESS" &&
                      orderQuery.data.result.logistics_status ===
                        "WAIT_SELLER_SEND_GOODS" &&
                      t("orderStatus.awaitingShipment")}
                    {orderQuery.data.result.order_status ===
                      "WAIT_BUYER_ACCEPT_GOODS" &&
                      orderQuery.data.result.logistics_status ===
                        "SELLER_SEND_GOODS" &&
                      t("orderStatus.awaitingReceptionConfirmation")}
                    {orderQuery.data.result.order_status === "FINISH" &&
                      t("orderStatus.finished")}
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
            detailsQuery.data.order.payment.receipt && (
              <>
                <h2 className="mt-2">
                  <span
                    className={`font-semibold text-xl font-mono ${TEXT_GRADIENT} `}
                  >
                    {t("paymentInfo")}
                  </span>
                </h2>
                <dl
                  className={`m-auto truncate ${PADDING} ${SHADOW} ${ROUNDED} `}
                >
                  <div className="p-2 sm:px-4 sm:py-5 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-bold lg:flex lg:items-center">
                      {t("paymentStatus.title")}
                    </dt>
                    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                      <div>
                        {!detailsQuery.data.order.payment.isPaymentConfirmed &&
                          !detailsQuery.data.order.payment.wasDeclined && (
                            <span className="text-warning uppercase font-bold text-sm">
                              {t("paymentStatus.awaitingConfirmation")}
                            </span>
                          )}
                        {detailsQuery.data.order.payment.isPaymentConfirmed && (
                          <span className="text-success uppercase font-bold text-sm">
                            {t("paymentStatus.confirmed")}
                          </span>
                        )}
                        {detailsQuery.data.order.payment.wasDeclined && (
                          <span className="text-danger uppercase font-bold text-sm">
                            {t("paymentStatus.declined")}
                          </span>
                        )}
                      </div>
                      <div>
                        {t("receipt")}{" "}
                        <Link
                          href={detailsQuery.data.order.payment.receipt}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <PhotoIcon
                            className="h-6 w-6 inline text-aliexpress"
                            aria-checked="true"
                          />
                        </Link>
                      </div>
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
                    {t("productInfo")}
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
                        {t("productId")}:{" "}
                        {detailsQuery.data.order.product.productId}
                      </p>
                      <p className="h-5 overflow-hidden text-ellipsis">
                        {detailsQuery.data.order.product.name}
                      </p>
                      <p className="font-mono text-aliexpress">
                        {t("price", {
                          price: detailsQuery.data.order.product.totalPrice,
                        })}
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
                    {t("addressInfo")}
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
            {info === "payment" && (
              <Pay
                price={detailsQuery.data?.order?.product?.totalPrice ?? 0}
                order_id={id}
                setIsOpen={setIsOpen}
              />
            )}
            {info === "tracking" && (
              <Tracking
                setIsOpen={setIsOpen}
                setMessage={setMessage}
                order_id={id}
                tracking_id={
                  orderQuery.data.result.logistics_info_list[0].logistics_no
                }
                service_name={
                  orderQuery.data.result.logistics_info_list[0]
                    .logistics_service
                }
              />
            )}
            {info === "confirm_cancel" && (
              <Cancel
                orderId={id}
                setIsOpen={setIsOpen}
                setMessage={setMessage}
              />
            )}
            {info === "confirm_receipt" && (
              <ConfirmReception
                order_id={id}
                setIsOpen={setIsOpen}
                setMessage={setMessage}
              />
            )}
          </Modal>
          <div className="mt-4 flex justify-end space-x-2">
            {orderQuery.data.result.order_status === "PLACE_ORDER_SUCCESS" && (
              <Button variant="solid" onClick={cancelOrderHandler}>
                {t("actions.cancel")}
              </Button>
            )}
            {orderQuery.data.result.order_status === "PLACE_ORDER_SUCCESS" &&
              !detailsQuery.data?.order?.payment?.receipt && (
                <Button variant="solid" onClick={paymentHandler}>
                  {t("actions.pay")}
                </Button>
              )}
            {orderQuery.data.result.logistics_status !== "NO_LOGISTICS" &&
              orderQuery.data.result.order_status !== "FINISH" && (
                <Button variant="solid" onClick={getTracking}>
                  {t("actions.track")}
                </Button>
              )}
            {orderQuery.data.result.order_status ===
              "WAIT_BUYER_ACCEPT_GOODS" &&
              !detailsQuery.data?.order?.received?.wasReceived && (
                <Button variant="solid" onClick={confirmReceptionHandler}>
                  {t("actions.confirm")}
                </Button>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
