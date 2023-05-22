/* eslint-disable @next/next/no-img-element */
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import { ZAE_Search } from "@reglini-types/zapiex";
import { GetPrice } from "@utils/index";
import { useFinance } from "@utils/store";
import { trpc } from "@utils/trpc";
import { IMessage } from "@reglini-types/index";

interface ProductCardProps {
  product: ZAE_Search["items"][0];
  setMessage: Dispatch<SetStateAction<IMessage | undefined>>;
}

const ProductCard = ({ product, setMessage }: ProductCardProps) => {
  const t = useTranslations("AliexpressPage");
  const { euro, commission } = useFinance();

  const { status } = useSession();
  const wishlistMutation = trpc.wishlist.add.useMutation();

  const wishlistHandler = async (product: any) => {
    if (status === "unauthenticated") {
      setTimeout(() => {
        setMessage({ type: undefined, text: undefined });
      }, 3000);
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
            product.productMinPrice.value
          ),
          imageUrl: product.imageUrl,
        },
        {
          onSettled(data, error) {
            if (error) setMessage({ type: "error", text: error.message });
            if (data) {
              if (!data.success)
                setMessage({ type: "error", text: data.error });
              else setMessage({ type: "success", text: data.message });
            }
          },
        }
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
          <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
            <Link href={`/aliexpress/product/${product.productId}`}>
              <div className="flex justify-center items-center overflow-hidden bg-gray-200 cursor-pointer">
                <img
                  className="object-center object-cover hover:opacity-75 rounded-lg shadow-lg"
                  src={product.imageUrl}
                  alt={product.productId}
                />
              </div>
            </Link>
          </div>
          <div className="flex justify-between">
            <div>
              <h1 className="mt-2 text-sm h-5 text-ellipsis overflow-hidden">
                {product.title}
              </h1>

              <p className={`font-mono`}>
                {t("price", {
                  price: GetPrice(
                    euro ?? 0,
                    commission ?? 0,
                    product.productMinPrice.value +
                      product.shippingMinPrice.value
                  ),
                })}
              </p>
            </div>
            <div>
              <button
                onClick={() => wishlistHandler(product)}
                className={`group flex rounded-md items-center w-full px-2 py-2 text-sm`}
              >
                <HeartIcon
                  className="text-black/50 dark:text-black/70 dark:hover:text-aliexpress hover:text-aliexpress w-5 h-5 inline"
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

export default ProductCard;
