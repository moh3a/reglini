/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  CursorArrowRaysIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { PADDING, ROUNDED, SHADOW, TEXT_GRADIENT } from "~/config/design";
import { Title, Loading, Button, Banner } from "~/components/shared";
import Edit from "~/components/account/details/EditAccount";
import EditAddress from "~/components/account/details/EditAddress";
import { trpc } from "~/utils/trpc";
import ItemProperties from "../ItemProperties";

import type { IMessage } from "~/types/index";
import type { Product } from "@prisma/client";

const CreateOrder = () => {
  const t = useTranslations("AccountPage");

  const router = useRouter();
  const { ref } = router.query;

  const profile = trpc.account.profile.useQuery();
  const emptyCartMutation = trpc.cart.empty.useMutation();
  const createOrderMutation = trpc.order.create.useMutation();

  const [products, setProducts] = useState<
    Omit<Product, "orderId">[] | undefined
  >();
  const [message, setMessage] = useState<IMessage>();
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const nproducts: Omit<Product, "orderId">[] = JSON.parse(
        localStorage.getItem("aeno") ?? "[]"
      ).map((p: Omit<Product, "orderId">) => {
        p.properties = JSON.stringify(p.properties);
        return p;
      });
      setProducts(nproducts);
    }
  }, []);

  useEffect(() => {
    if (profile.data && profile.data.user) {
      if (products && products.length > 0) {
        setValid(true);
      } else setValid(false);
    } else setValid(false);
  }, [products, profile.data]);

  const createOrderHandler = async () => {
    if (profile.data && profile.data.user && products) {
      if (
        profile.data.user.profile?.phoneNumber &&
        profile.data.user.profile?.realName &&
        profile.data.user.address?.postalCode
      ) {
        await createOrderMutation.mutateAsync(
          {
            products,
            shippingAddress: {
              countryCode: "DZ",
              name: profile.data.user.profile?.realName,
              phoneCountry: "+213",
              mobilePhone: profile.data.user.profile?.phoneNumber.replace(
                "+213",
                "0"
              ),
              city: profile.data.user.address?.commune ?? "",
              addressLine1: profile.data.user.address?.streetName ?? "",
              province: profile.data.user.address?.wilaya ?? "",
              zipCode: profile.data.user.address?.postalCode,
            },
          },
          {
            onSettled(data, error) {
              if (error) setMessage({ type: "error", text: error.message });
              if (data) {
                if (data.success) {
                  if (ref?.toString() === "cart") {
                    emptyCartMutation.mutate();
                  }
                  setMessage({ type: "success", text: data.message });
                  router.push("/account/orders");
                } else setMessage({ type: "error", text: data.error });
              }
              setTimeout(
                () => setMessage({ type: undefined, text: undefined }),
                3000
              );
            },
          }
        );
      } else {
        setMessage({ type: "error", text: "Fill the required fields." });
        setTimeout(() => {
          setMessage({ type: undefined, text: undefined });
        }, 3000);
      }
    }
  };

  return (
    <div className="mb-10">
      <Title center={true} title="Place a new order" />
      <dl className={`max-w-2xl m-auto ${PADDING} ${SHADOW} ${ROUNDED} `}>
        {profile.isLoading && (
          <div className="w-full flex justify-center items-center">
            <Loading size="medium" />
          </div>
        )}
        {profile.data && profile.data.user && (
          <>
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
              <dt className="text-sm font-bold lg:flex lg:items-center">
                {t("details.fullName")}
              </dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <Edit
                  title={t("details.fullName")}
                  field="realName"
                  type="text"
                  value={profile.data.user.profile?.realName}
                />
              </dd>
            </div>
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
              <dt className="text-sm font-bold lg:flex lg:items-center">
                {t("details.phoneNumber")}
              </dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <Edit
                  title={t("details.phoneNumber")}
                  field="phoneNumber"
                  type="text"
                  value={profile.data.user.profile?.phoneNumber}
                />
              </dd>
            </div>
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
              <dt className="text-sm font-bold lg:flex lg:items-center">
                {t("details.address.title")}
              </dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <EditAddress
                  field="address"
                  value={profile.data.user.address}
                />
              </dd>
            </div>
          </>
        )}
        <div className="px-4 py-5 font-bold font-mono text-sm text-center whitespace-normal">
          {t("orders.paymentTimout")}
        </div>
        <div className="px-4 py-5">
          <dt className="text-sm font-bold lg:flex lg:items-center">
            {t("orders.product.title")}
          </dt>
          {products &&
            products.map((product, index) => (
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
                  <p className="text-sm font-mono">
                    {t("orders.product.productPrice")}:{" "}
                    {t("price", { price: product.price })}
                  </p>
                  <p className="text-sm font-mono">
                    {t("orders.product.shippingPrice")}:{" "}
                    {t("price", { price: product.shippingPrice })}
                  </p>
                  <p className="text-sm font-mono">
                    {t("orders.product.quantity")}: {product.quantity}
                  </p>
                  <p className={`text-sm font-mono`}>
                    <span className={TEXT_GRADIENT + " font-extrabold"}>
                      {t("orders.product.total")}:{" "}
                      {t("price", { price: product.totalPrice })}
                    </span>
                  </p>
                </div>
              </dd>
            ))}
        </div>
        {message?.type && (
          <Banner type={message?.type} message={message?.text} />
        )}
        <div className="flex justify-end px-4 py-5">
          <Button
            icon={
              <CursorArrowRaysIcon
                className="h-5 w-5 inline mr-1"
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
                          className="h-5 w-5 text-success inline mr-1"
                          aria-hidden="true"
                        />
                      ) : (
                        <XMarkIcon
                          className="h-5 w-5 text-danger inline mr-1"
                          aria-hidden="true"
                        />
                      )}
                      {t("orders.validation.addPhoneNumber")}
                    </li>
                    <li>
                      {profile.data.user.profile?.realName ? (
                        <CheckBadgeIcon
                          className="h-5 w-5 text-success inline mr-1"
                          aria-hidden="true"
                        />
                      ) : (
                        <XMarkIcon
                          className="h-5 w-5 text-danger inline mr-1"
                          aria-hidden="true"
                        />
                      )}
                      {t("orders.validation.addName")}
                    </li>
                    <li>
                      {profile.data.user.address?.postalCode ? (
                        <CheckBadgeIcon
                          className="h-5 w-5 text-success inline mr-1"
                          aria-hidden="true"
                        />
                      ) : (
                        <XMarkIcon
                          className="h-5 w-5 text-danger inline mr-1"
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
