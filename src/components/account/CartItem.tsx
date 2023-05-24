/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import NumberInput from "@components/shared/NumberInput";
import Button from "@components/shared/Button";
import Banner from "@components/shared/Banner";
import ItemProperties from "@components/account/ItemProperties";
import { AENOProduct, IMessage } from "@reglini-types/index";
import { Cart } from "@prisma/client";
import { trpc } from "@utils/trpc";

const CartItem = ({ item }: { item: AENOProduct | Cart }) => {
  const t = useTranslations("Common.cart");
  const [message, setMessage] = useState<IMessage>();

  const utils = trpc.useContext();
  const deleteItemMutation = trpc.cart.delete.useMutation();
  const deleteHanlder = async () => {
    if (item.id) {
      await deleteItemMutation.mutateAsync(
        { id: item.id },
        {
          onSettled(data, error) {
            if (error) setMessage({ type: "error", text: error.message });
            if (data) {
              if (data.success) {
                setMessage({ type: "success", text: data.message });
                utils.cart.invalidate();
              } else setMessage({ type: "error", text: data.error });
            }
            setTimeout(
              () => setMessage({ type: undefined, text: undefined }),
              3000
            );
          },
        }
      );
    }
  };

  const quantityUpdateMutation = trpc.cart.updateQuantity.useMutation();
  const quantityHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    await quantityUpdateMutation.mutateAsync(
      { id: item.id, quantity: parseInt(event.target.value ?? 1) },
      {
        onSettled(data, error) {
          if (error) setMessage({ type: "error", text: error.message });
          if (data) {
            if (data.success) {
              setMessage({ type: "success", text: data.message });
              utils.cart.invalidate();
            } else setMessage({ type: "error", text: data.error });
          }
          setTimeout(
            () => setMessage({ type: undefined, text: undefined }),
            3000
          );
        },
      }
    );
  };

  return (
    <>
      {message?.type && <Banner type={message?.type} message={message?.text} />}
      <li className={`py-6 flex`}>
        <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
          <img
            className="w-full h-full object-center object-cover"
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
            <p className={`text-aliexpress font-bold font-mono`}>
              {t("price", { price: item.price })}
            </p>
          </div>

          <ItemProperties product={item} />

          <div className={`text-xs my-2`}>
            <p>
              {t("shippingCarrier")}:{" "}
              <span className="px-2 font-bold">{item.carrierId}</span>
            </p>
            <p>
              {t("shippingPrice")}:
              <span className={`px-2 font-bold font-mono`}>
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
                className="h-6 w-6 inline text-aliexpress"
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
