/* eslint-disable @next/next/no-img-element */
import { type ChangeEvent, useState } from "react";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import type { Cart, Product } from "@prisma/client";
import type { IMessage } from "~/types/index";

import { NumberInput, Button, Banner } from "~/components/shared";
import ItemProperties from "~/components/account/ItemProperties";
import { api } from "~/utils/api";

const CartItem = ({ item }: { item: Omit<Product, "orderId"> | Cart }) => {
  const t = useTranslations("Common.cart");
  const [message, setMessage] = useState<IMessage>();

  const utils = api.useContext();
  const deleteItemMutation = api.cart.delete.useMutation();
  const deleteHanlder = (): void => {
    if (item.id) {
      deleteItemMutation.mutate(
        { id: item.id },
        {
          onSettled(data, error) {
            if (error) setMessage({ type: "error", text: error.message });
            if (data) {
              if (data.success) {
                setMessage({ type: "success", text: data.message });
                void utils.cart.invalidate();
              } else setMessage({ type: "error", text: data.error });
            }
            setTimeout(
              () => setMessage({ type: undefined, text: undefined }),
              3000,
            );
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
          if (error) setMessage({ type: "error", text: error.message });
          if (data) {
            if (data.success) {
              setMessage({ type: "success", text: data.message });
              void utils.cart.invalidate();
            } else setMessage({ type: "error", text: data.error });
          }
          setTimeout(
            () => setMessage({ type: undefined, text: undefined }),
            3000,
          );
        },
      },
    );
  };

  return (
    <>
      {message?.type && <Banner type={message?.type} message={message?.text} />}
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
