/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useSession } from "next-auth/react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import type { RAE_SearchItem } from "~/types/ae/rae";
import { GetPrice } from "~/utils/index";
import { api } from "~/utils/api";
import { useFinance, useMessage } from "~/utils/store";

interface ProductCardProps {
  product: RAE_SearchItem;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const t = useTranslations("AliexpressPage");

  const { status } = useSession();
  const { setMessage } = useMessage();
  const { commission, euro } = useFinance();

  const wishlistMutation = api.wishlist.add.useMutation();

  const wishlistHandler = async (product: RAE_SearchItem) => {
    if (status === "unauthenticated") {
      setMessage({
        type: "error",
        text: "You should be logged in to do this action.",
      });
    }

    if (status === "authenticated") {
      await wishlistMutation.mutateAsync(
        {
          productId: product.productId,
          name: product.title,
          price: GetPrice(
            euro ?? 0,
            commission ?? 0,
            product.productMinPrice.value,
          ),
          imageUrl: product.imageUrl,
        },
        {
          onSettled(data, error) {
            if (error) setMessage({ type: "error", text: error.message });
            if (data) {
              if (!data.success)
                setMessage({ type: "error", text: data.error ?? "" });
              else setMessage({ type: "success", text: data.message ?? "" });
            }
          },
        },
      );
    }
  };

  return (
    <>
      {product && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          key={product.productId}
          className="group"
        >
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
            <Link href={`/aliexpress/product/${product.productId}`}>
              <div className="flex cursor-pointer items-center justify-center overflow-hidden bg-gray-200">
                <img
                  className="rounded-lg object-cover object-center shadow-lg hover:opacity-75"
                  src={product.imageUrl}
                  alt={product.productId}
                />
              </div>
            </Link>
          </div>
          <div className="flex justify-between">
            <div>
              <h1 className="mt-2 h-5 overflow-hidden text-ellipsis text-sm">
                {product.title}
              </h1>

              <p className={`font-mono`}>
                {t("price", {
                  price: GetPrice(
                    euro ?? 0,
                    commission ?? 0,
                    product.shippingMinPrice
                      ? product.productMinPrice.value +
                          product.shippingMinPrice.value
                      : product.productMinPrice.value,
                  ),
                })}
              </p>
            </div>
            <div>
              <button
                onClick={() => void wishlistHandler(product)}
                className={`group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                <HeartIcon
                  className="inline h-5 w-5 text-black/50 hover:text-aliexpress dark:text-black/70 dark:hover:text-aliexpress"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};
