/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { MapPinIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { PADDING, ROUNDED, SHADOW, TEXT_GRADIENT } from "~/config/design";
import { Button, Loading, Modal } from "~/components/shared";
import Pay from "~/components/account/orders/actions/Pay";
import Cancel from "~/components/account/orders/actions/Cancel";
import Tracking from "~/components/account/orders/actions/Tracking";
import ConfirmReception from "~/components/account/orders/actions/ConfirmReception";
import ItemProperties from "~/components/account/ItemProperties";
import { api } from "~/utils/api";
import { useMessage } from "~/utils/store";

interface OrderDetailsProps {
  id: string;
}

const OrderDetails = ({ id }: OrderDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [info, setInfo] = useState<
    "tracking" | "payment" | "confirm_cancel" | "confirm_receipt" | undefined
  >();
  const { setMessage } = useMessage();

  const orderQuery = api.order.get.useQuery(
    { order_id: id },
    {
      onSettled(data, error) {
        console.log(data);
        if (error)
          setMessage({ type: "error", text: "Order details fetch error." });
        if (data && !data.success)
          setMessage({ type: "error", text: data.error ?? "" });
      },
    },
  );
  const detailsQuery = api.order.details.useQuery({ order_id: id });

  const cancelOrderHandler = () => {
    if (orderQuery.data?.result?.order_status === "PLACE_ORDER_SUCCESS") {
      setInfo("confirm_cancel");
      setIsOpen(true);
    }
  };

  const paymentHandler = () => {
    if (
      orderQuery.data?.result?.order_status === "PLACE_ORDER_SUCCESS" &&
      !detailsQuery.data?.order?.payment?.receipt
    ) {
      setInfo("payment");
      setIsOpen(true);
    }
  };

  const getTracking = () => {
    if (orderQuery?.data?.result?.logistics_info_list) {
      setInfo("tracking");
      setIsOpen(true);
    }
  };

  const confirmReceptionHandler = () => {
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
    <div className="mx-auto max-w-xl px-4">
      {orderQuery.isLoading && (
        <div className="flex w-full items-center justify-center">
          <Loading size="medium" />
        </div>
      )}
      {orderQuery.data?.result && (
        <div>
          <div>
            <h2 className="mt-2">
              <span
                className={`font-mono text-xl font-semibold ${TEXT_GRADIENT} `}
              >
                {t("orderInfo")}
              </span>
            </h2>
            <dl className={`m-auto truncate ${PADDING} ${SHADOW} ${ROUNDED} `}>
              <div className="p-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3 sm:py-4">
                <dt className="text-sm font-bold lg:flex lg:items-center">
                  {t("orderId")}
                </dt>
                <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{id}</dd>
              </div>
              {orderQuery.data.result.gmt_create && (
                <div className="p-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3 sm:py-4">
                  <dt className="text-sm font-bold lg:flex lg:items-center">
                    {t("orderDate")}
                  </dt>
                  <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                    {orderQuery.data.result.gmt_create}
                  </dd>
                </div>
              )}
              <div className="p-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3 sm:py-4">
                <dt className="text-sm font-bold lg:flex lg:items-center">
                  {t("orderStatus.title")}
                </dt>
                <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                  <span className={"font-bold uppercase text-aliexpress"}>
                    {orderQuery.data.result.order_status ===
                      "PLACE_ORDER_SUCCESS" &&
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
            <div className="flex w-full items-center justify-center">
              <Loading size="medium" />
            </div>
          )}
          {detailsQuery.data?.order?.payment?.receipt && (
            <>
              <h2 className="mt-2">
                <span
                  className={`font-mono text-xl font-semibold ${TEXT_GRADIENT} `}
                >
                  {t("paymentInfo")}
                </span>
              </h2>
              <dl
                className={`m-auto truncate ${PADDING} ${SHADOW} ${ROUNDED} `}
              >
                <div className="grid grid-cols-3 gap-4 p-2 sm:px-4 sm:py-5">
                  <dt className="text-sm font-bold lg:flex lg:items-center">
                    {t("paymentStatus.title")}
                  </dt>
                  <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                    <div>
                      {!detailsQuery.data.order.payment.isPaymentConfirmed &&
                        !detailsQuery.data.order.payment.wasDeclined && (
                          <span className="text-sm font-bold uppercase text-warning">
                            {t("paymentStatus.awaitingConfirmation")}
                          </span>
                        )}
                      {detailsQuery.data.order.payment.isPaymentConfirmed && (
                        <span className="text-sm font-bold uppercase text-success">
                          {t("paymentStatus.confirmed")}
                        </span>
                      )}
                      {detailsQuery.data.order.payment.wasDeclined && (
                        <span className="text-sm font-bold uppercase text-danger">
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
                          className="inline h-6 w-6 text-aliexpress"
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
            detailsQuery.data.order.products && (
              <>
                <h2 className="mt-2">
                  <span
                    className={`font-mono text-xl font-semibold ${TEXT_GRADIENT} `}
                  >
                    {t("productInfo")}
                  </span>
                </h2>
                <dl
                  className={`m-auto truncate ${PADDING} ${SHADOW} ${ROUNDED} p-2 sm:px-4 sm:py-5 `}
                >
                  {detailsQuery.data.order.products.map((product) => (
                    <Link
                      key={product.productId}
                      href={`/aliexpress/product/${product.productId}`}
                      target={"_blank"}
                    >
                      <div className="grid grid-cols-5 gap-4 py-2">
                        <dt className="flex items-center justify-center">
                          <img
                            src={product.imageUrl ?? "/placeholder.png"}
                            alt={product.productId}
                            className={` ${ROUNDED} w-20`}
                          />
                        </dt>
                        <dd className="col-span-4 text-sm">
                          <p className="font-bold">
                            {t("productId")}: {product.productId}
                          </p>
                          <p className="h-5 overflow-hidden text-ellipsis">
                            {product.name}
                          </p>
                          <ItemProperties product={product} />
                          <p className="font-mono text-aliexpress">
                            {t("price", {
                              price: product.totalPrice,
                            })}
                          </p>
                        </dd>
                      </div>
                    </Link>
                  ))}
                </dl>
              </>
            )}
          {detailsQuery.data &&
            detailsQuery.data.order &&
            detailsQuery.data.order.shippingAddress && (
              <>
                <h2 className="mt-2">
                  <span
                    className={`font-mono text-xl font-semibold ${TEXT_GRADIENT} `}
                  >
                    {t("addressInfo")}
                  </span>
                </h2>
                <section>
                  <div className="flex">
                    <div className="flex w-20 items-center justify-center">
                      <MapPinIcon
                        className="h-5 w-5 text-aliexpress"
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
            {info === "payment" && detailsQuery.data?.order?.products && (
              <Pay
                products={detailsQuery.data?.order?.products}
                order_id={id}
                setIsOpen={setIsOpen}
              />
            )}
            {info === "tracking" && (
              <Tracking
                setIsOpen={setIsOpen}
                order_id={id}
                tracking_id={
                  orderQuery.data.result.logistics_info_list[0]?.logistics_no ??
                  ""
                }
                service_name={
                  orderQuery.data.result.logistics_info_list[0]
                    ?.logistics_service ?? ""
                }
              />
            )}
            {info === "confirm_cancel" && (
              <Cancel orderId={id} setIsOpen={setIsOpen} />
            )}
            {info === "confirm_receipt" && (
              <ConfirmReception order_id={id} setIsOpen={setIsOpen} />
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
