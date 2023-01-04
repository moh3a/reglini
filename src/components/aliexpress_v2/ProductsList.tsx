/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";

import Loading from "@components/shared/Loading";
import Modal from "@components/shared/Modal";
import { trpc } from "@utils/trpc";

const ProductsList = () => {
  const router = useRouter();
  const { q, p } = router.query;

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<{
    type?: "success" | "error";
    text?: string;
  }>();

  const searchProducts = trpc.zapiex.search.useQuery({
    text: q as string,
    locale: router.locale,
    page: parseInt((p as string) ?? "1"),
  });

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
          id: product.productId,
          name: product.title,
          price: product.productMinPrice.value,
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
    <div className="my-8 mx-2">
      {message?.type && (
        <Modal
          title={message.type.toUpperCase()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        >
          {message.text}
        </Modal>
      )}
      {searchProducts.isLoading && (
        <div className="w-full flex justify-center items-center">
          <Loading size="large" />
        </div>
      )}
      {searchProducts.data && searchProducts.data.data && (
        <>
          <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {searchProducts.data.data.items.map((product) => (
              <div key={product.productId} className="group">
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

                    <p className={`font-medium`}>
                      <span>
                        {product.productMinPrice.value +
                          product.shippingMinPrice.value}
                      </span>{" "}
                      <span>€</span>
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
              </div>
            ))}
          </div>
          {/* <Pagination
            current={parseInt(p?.toString() ?? "1")}
            unitsPerPage={searchProducts.data.data.resultsPerPage}
            totalUnits={searchProducts.data.data.totalCount}
          /> */}
        </>
      )}
    </div>
  );
};

export default ProductsList;
