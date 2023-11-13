/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  CursorArrowRaysIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import type { Product } from "@prisma/client";

import { PADDING, ROUNDED, SHADOW, TEXT_GRADIENT } from "~/config/design";
import {
  ALGERIAN_PHONE_COUNTRY_CODE,
  DEFAULT_COUNTRY_SHIPPED_TO,
  NEW_ORDER_LOCAL_STORAGE_NAME,
} from "~/config/constants";
import { Title, Loading, Button } from "~/components/shared";
import { Edit, EditAddress } from "~/components/account/details";
import ItemProperties from "~/components/account/ItemProperties";
import { api } from "~/utils/api";
import { useMessage } from "~/utils/store";

const CreateOrder = () => {
  const t = useTranslations("AccountPage");

  const router = useRouter();
  const { ref } = router.query;

  const profile = api.account.profile.useQuery();
  const emptyCartMutation = api.cart.empty.useMutation();
  const createOrderMutation = api.order.create.useMutation();

  const products = useMemo(
    () =>
      typeof window !== "undefined"
        ? (
            JSON.parse(
              localStorage.getItem(NEW_ORDER_LOCAL_STORAGE_NAME)
                ? localStorage.getItem(NEW_ORDER_LOCAL_STORAGE_NAME)!
                : "[]",
            ) as Omit<Product, "orderId">[]
          ).map((p) => {
            p.properties = JSON.stringify(p.properties);
            return p;
          })
        : [],
    [],
  );

  const { setTimedMessage } = useMessage();
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (profile.data && profile.data.user && products && products.length > 0) {
      setValid(true);
    } else setValid(false);
  }, [products, profile.data]);

  const createOrderHandler = () => {
    if (profile.data && profile.data.user && products) {
      if (
        profile.data.user.profile?.phoneNumber &&
        profile.data.user.profile?.realName &&
        profile.data.user.address?.postalCode
      ) {
        createOrderMutation.mutate(
          {
            products,
            shippingAddress: {
              countryCode: DEFAULT_COUNTRY_SHIPPED_TO,
              name: profile.data.user.profile?.realName,
              phoneCountry: ALGERIAN_PHONE_COUNTRY_CODE,
              mobilePhone: profile.data.user.profile?.phoneNumber.replace(
                ALGERIAN_PHONE_COUNTRY_CODE,
                "0",
              ),
              city: profile.data.user.address?.commune ?? "",
              addressLine1: profile.data.user.address?.streetName ?? "",
              province: profile.data.user.address?.wilaya ?? "",
              zipCode: profile.data.user.address?.postalCode,
            },
          },
          {
            onSettled(data, error) {
              if (error)
                setTimedMessage({
                  type: "error",
                  text: error.message ?? "",
                  duration: 3000,
                });
              if (data) {
                if (data.success) {
                  if (ref?.toString() === "cart") {
                    emptyCartMutation.mutate();
                  }
                  setTimedMessage({
                    type: "success",
                    text: data.message ?? "",
                    duration: 3000,
                  });
                  void router.push("/account/orders");
                } else
                  setTimedMessage({
                    type: "error",
                    text: data.error ?? "",
                    duration: 3000,
                  });
              }
            },
          },
        );
      } else {
        setTimedMessage({
          type: "error",
          text: "Fill the required fields.",
          duration: 3000,
        });
      }
    }
  };

  return (
    <div className="mb-10">
      <Title center={true} title="Place a new order" />
      <dl className={`m-auto max-w-2xl ${PADDING} ${SHADOW} ${ROUNDED} `}>
        {profile.isLoading && (
          <div className="flex w-full items-center justify-center">
            <Loading size="medium" />
          </div>
        )}
        {profile.data && profile.data.user && (
          <>
            {profile.data.user.profile?.realName && (
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
                <dt className="text-sm font-bold lg:flex lg:items-center">
                  {t("details.fullName")}
                </dt>
                <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                  <Edit
                    title={t("details.fullName")}
                    field="realName"
                    type="text"
                    value={profile.data.user.profile?.realName}
                  />
                </dd>
              </div>
            )}
            {profile.data.user.profile?.phoneNumber && (
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
                <dt className="text-sm font-bold lg:flex lg:items-center">
                  {t("details.phoneNumber")}
                </dt>
                <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                  <Edit
                    title={t("details.phoneNumber")}
                    field="phoneNumber"
                    type="text"
                    value={profile.data.user.profile?.phoneNumber}
                  />
                </dd>
              </div>
            )}
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
              <dt className="text-sm font-bold lg:flex lg:items-center">
                {t("details.address.title")}
              </dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                <EditAddress
                  field="address"
                  value={profile.data.user.address}
                />
              </dd>
            </div>
          </>
        )}
        <div className="whitespace-normal px-4 py-5 text-center font-mono text-sm font-bold">
          {t("orders.paymentTimout")}
        </div>
        <div className="px-4 py-5">
          <dt className="text-sm font-bold lg:flex lg:items-center">
            {t("orders.product.title")}
          </dt>
          {products?.map((product, index) => (
            <dd key={index} className="flex space-x-2">
              {product.imageUrl && (
                <div>
                  <img
                    src={product.imageUrl}
                    alt={product.name ?? "product image"}
                    width={200}
                    className={`${ROUNDED} ${SHADOW}`}
                  />
                </div>
              )}
              <div className="flex flex-col whitespace-normal">
                <p className="font-bold">{product.name}</p>
                <ItemProperties product={product} />
                <p className="font-mono text-sm">
                  {t("orders.product.productPrice")}:{" "}
                  {t("price", { price: product.price })}
                </p>
                <p className="font-mono text-sm">
                  {t("orders.product.shippingPrice")}:{" "}
                  {t("price", { price: product.shippingPrice })}
                </p>
                <p className="font-mono text-sm">
                  {t("orders.product.quantity")}: {product.quantity}
                </p>
                <p className={`font-mono text-sm`}>
                  <span className={TEXT_GRADIENT + " font-extrabold"}>
                    {t("orders.product.total")}:{" "}
                    {t("price", { price: product.totalPrice })}
                  </span>
                </p>
              </div>
            </dd>
          ))}
        </div>
        <div className="flex justify-end px-4 py-5">
          <Button
            icon={
              <CursorArrowRaysIcon
                className="mr-1 inline h-5 w-5"
                aria-hidden="true"
              />
            }
            disabled={!valid || createOrderMutation.isLoading}
            tooltip={
              <ul>
                {profile.data && profile.data.user && (
                  <>
                    <li>
                      {profile.data.user.profile?.phoneNumber ? (
                        <CheckBadgeIcon
                          className="mr-1 inline h-5 w-5 text-success"
                          aria-hidden="true"
                        />
                      ) : (
                        <XMarkIcon
                          className="mr-1 inline h-5 w-5 text-danger"
                          aria-hidden="true"
                        />
                      )}
                      {t("orders.validation.addPhoneNumber")}
                    </li>
                    <li>
                      {profile.data.user.profile?.realName ? (
                        <CheckBadgeIcon
                          className="mr-1 inline h-5 w-5 text-success"
                          aria-hidden="true"
                        />
                      ) : (
                        <XMarkIcon
                          className="mr-1 inline h-5 w-5 text-danger"
                          aria-hidden="true"
                        />
                      )}
                      {t("orders.validation.addName")}
                    </li>
                    <li>
                      {profile.data.user.address?.postalCode ? (
                        <CheckBadgeIcon
                          className="mr-1 inline h-5 w-5 text-success"
                          aria-hidden="true"
                        />
                      ) : (
                        <XMarkIcon
                          className="mr-1 inline h-5 w-5 text-danger"
                          aria-hidden="true"
                        />
                      )}
                      {t("orders.validation.addAddress")}
                    </li>
                  </>
                )}
              </ul>
            }
            variant="solid"
            type="button"
            onClick={createOrderHandler}
          >
            {t("orders.product.placeOrder")}
          </Button>
        </div>
      </dl>
    </div>
  );
};

export default CreateOrder;
