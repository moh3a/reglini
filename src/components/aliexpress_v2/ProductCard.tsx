/* eslint-disable @next/next/no-img-element */
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import { Affiliate_Hotproducts_Result } from "@reglini-types/ae";
import { GetPrice } from "@utils/index";
import { useFinance } from "@utils/store";
import { trpc } from "@utils/trpc";
import { IMessage } from "@reglini-types/index";

interface ProductCardProps {
  product: Affiliate_Hotproducts_Result["resp_result"]["result"]["products"][0];
  setMessage: Dispatch<SetStateAction<IMessage | undefined>>;
}

const ProductCard = ({ product, setMessage }: ProductCardProps) => {
  const t = useTranslations("AliexpressPage");
  const { usd, commission } = useFinance();

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
          productId: product.product_id.toString(),
          name: product.product_title,
          price: product.target_app_sale_price
            ? GetPrice(
                usd ?? 0,
                commission ?? 0,
                Number(product.target_app_sale_price)
              )
            : GetPrice(
                usd ?? 0,
                commission ?? 0,
                Number(product.target_original_price)
              ),
          imageUrl: product.product_main_image_url,
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
          key={product.product_id}
          className="group"
        >
          <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
            <Link href={`/aliexpress/product/${product.product_id}`}>
              <div className="flex justify-center items-center overflow-hidden bg-gray-200 cursor-pointer">
                <img
                  className="object-center object-cover hover:opacity-75 rounded-lg shadow-lg"
                  src={product.product_main_image_url}
                  alt={product.product_title}
                />
              </div>
            </Link>
          </div>
          <div className="flex justify-between">
            <div>
              <h1 className="mt-2 text-sm h-5 text-ellipsis overflow-hidden">
                {product.product_title}
              </h1>
              <h2 className="text-xs text-gray-500">
                {product.second_level_category_name
                  ? product.second_level_category_name
                  : product.first_level_category_name}
              </h2>

              <p className={`font-mono`}>
                {t("price", {
                  price: GetPrice(
                    usd ?? 0,
                    commission ?? 0,
                    Number(product.target_app_sale_price ?? 0)
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
