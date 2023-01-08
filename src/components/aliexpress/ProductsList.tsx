/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";

import Loading from "@components/shared/Loading";
import Modal from "@components/shared/Modal";
import { trpc } from "@utils/trpc";
import { GetPrice } from "@utils/index";
import { useFinance } from "@utils/store";

const ProductsList = () => {
  const { euro, usd, commission } = useFinance();
  const router = useRouter();
  const { q, p } = router.query;

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<{
    type?: "success" | "error";
    text?: string;
  }>();
  useEffect(() => {
    if (message?.type) setIsOpen(true);
    else setIsOpen(false);
  }, [message?.type]);

  const searchZapiexProducts = trpc.zapiex.search.useQuery({
    text: q as string,
    locale: router.locale,
    page: parseInt((p as string) ?? "1"),
  });

  const searchAffiliateProducts = trpc.aliexpress.affiliate.search.useQuery({
    locale: router.locale,
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
    let productObj = product.productId
      ? {
          id: product.productId,
          name: product.title,
          price: GetPrice(
            euro ?? 0,
            commission ?? 0,
            product.productMinPrice.value
          ),
          imageUrl: product.imageUrl,
        }
      : {
          id: product.product_id.toString(),
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
        };
    if (status === "authenticated") {
      await wishlistMutation.mutateAsync(productObj, {
        onSettled(data, error) {
          if (error) setMessage({ type: "error", text: error.message });
          if (data) {
            if (!data.success) setMessage({ type: "error", text: data.error });
            else setMessage({ type: "success", text: data.message });
          }
        },
      });
    }
  };

  return (
    <div className="my-8 mx-2">
      <Modal
        type={message?.type}
        title={message?.type?.toUpperCase()}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        {message?.text}
      </Modal>

      {q ? (
        <>
          {searchZapiexProducts.isLoading && (
            <div className="w-full flex justify-center items-center">
              <Loading size="large" />
            </div>
          )}
          {searchZapiexProducts.data && searchZapiexProducts.data.data && (
            <>
              <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {searchZapiexProducts.data.data.items.map((product) => (
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

                        <p className={`font-mono`}>
                          <span>
                            {GetPrice(
                              euro ?? 0,
                              commission ?? 0,
                              product.productMinPrice.value +
                                product.shippingMinPrice.value
                            )}
                          </span>{" "}
                          <span>DZD</span>
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
        </>
      ) : (
        <>
          {searchAffiliateProducts.isLoading && (
            <div className="w-full flex justify-center items-center">
              <Loading size="large" />
            </div>
          )}
          {searchAffiliateProducts.data &&
            searchAffiliateProducts.data.resp_result &&
            searchAffiliateProducts.data.resp_result.result &&
            searchAffiliateProducts.data.resp_result.result
              .current_record_count > 0 && (
              <>
                <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                  {searchAffiliateProducts.data.resp_result.result.products.map(
                    (product) => (
                      <div key={product.product_id} className="group">
                        <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                          <Link
                            href={`/aliexpress/product/${product.product_id}`}
                          >
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
                              <span>
                                {GetPrice(
                                  usd ?? 0,
                                  commission ?? 0,
                                  Number(product.target_app_sale_price ?? 0)
                                )}
                              </span>{" "}
                              <span>DZD</span>
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
                    )
                  )}
                </div>
              </>
            )}
        </>
      )}
    </div>
  );
};

export default ProductsList;
