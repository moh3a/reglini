/* eslint-disable @next/next/no-img-element */
import { type ChangeEvent } from "react";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import type { Cart, Product } from "@prisma/client";

import { NumberInput, Button } from "~/components/shared";
import ItemProperties from "~/components/account/ItemProperties";
import { api } from "~/utils/api";
import { useMessage } from "~/utils/store";

const CartItem = ({ item }: { item: Omit<Product, "orderId"> | Cart }) => {
  const t = useTranslations("Common.cart");
  const { setTimedMessage } = useMessage();

  const utils = api.useContext();
  const deleteItemMutation = api.cart.delete.useMutation();
  const deleteHanlder = (): void => {
    if (item.id) {
      deleteItemMutation.mutate(
        { id: item.id },
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
                setTimedMessage({
                  type: "success",
                  text: data.message ?? "",
                  duration: 3000,
                });
                void utils.cart.invalidate();
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
    }
  };

  const quantityUpdateMutation = api.cart.updateQuantity.useMutation();
  const quantityHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    quantityUpdateMutation.mutate(
      { id: item.id, quantity: parseInt(event.target.value ?? 1) },
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
              setTimedMessage({
                type: "success",
                text: data.message ?? "",
                duration: 3000,
              });
              void utils.cart.invalidate();
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
  };

  return (
    <>
      <li className={`flex py-6`}>
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <img
            className="h-full w-full object-cover object-center"
            src={item.imageUrl ? item.imageUrl : "/placeholder.png"}
            alt={item.name ? item.name : ""}
          />
        </div>

        <div className={`ml-2 flex-col`}>
          <div
            className={`flex flex-col justify-between text-base font-medium`}
          >
            <h1>
              <Link
                href={`/aliexpress/product/${item.productId ?? item.id}`}
                target="_blank"
              >
                {item.name}
              </Link>
            </h1>
            <p className={`font-mono font-bold text-aliexpress`}>
              {t("price", { price: item.price })}
            </p>
          </div>

          <ItemProperties product={item} />

          <div className={`my-2 text-xs`}>
            <p>
              {t("shippingCarrier")}:{" "}
              <span className="px-2 font-bold">{item.carrierId}</span>
            </p>
            <p>
              {t("shippingPrice")}:
              <span className={`px-2 font-mono font-bold`}>
                {t("price", { price: item.shippingPrice })}
              </span>
            </p>
          </div>
          <div className={`flex items-center space-x-1 text-sm `}>
            <p>{t("qty")}</p>
            <NumberInput
              value={item.quantity ?? 1}
              min={1}
              step={1}
              onKeyDown={(e) => e.preventDefault()}
              onChange={quantityHandler}
              max={100}
            />
            <Button variant="outline" onClick={deleteHanlder}>
              <span className="sr-only">delete item</span>
              <TrashIcon
                className="inline h-6 w-6 text-aliexpress"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      </li>
    </>
  );
};

export default CartItem;
