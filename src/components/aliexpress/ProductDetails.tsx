import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useTranslations } from "next-intl";
import type { AE_Language } from "ae_sdk";

import type { RAE_ProductShippingCarrier } from "~/types/ae/rae";
import type {
  ProductProperty as IProductProperty,
  SelectedVariation,
} from "~/types/index";
import { Loading, Title } from "~/components/shared";
import {
  AddToCart,
  AddToWishlist,
  ProductFeatures,
  BuyProduct,
  ProductImage,
  ProductPrice,
  ProductProperty,
  ProductQuantity,
  ProductReviews,
  ProductShipping,
} from "~/components/aliexpress/details";
import { api } from "~/utils/api";
import { API_RESPONSE_MESSAGES, APP_NAME } from "~/config/constants";
import { ONE_DAY_IN_SECONDS, select_product_variation } from "~/utils/index";
import { SkeletonProductsColumn } from "./SkeletonProducts";
import { ProductCard } from "./ProductCard";
import { useMessage } from "~/utils/store";

export const ProductDetails = ({ id }: { id: string }) => {
  const router = useRouter();
  const { setMessage } = useMessage();
  const [quantity, setQuantity] = useState(1);
  const [showImage, setShowImage] = useState("/placeholder.png");
  const [selectedShipping, setSelectedShipping] = useState<
    RAE_ProductShippingCarrier | undefined
  >();

  const product = api.aliexpress.ds.product.useQuery(
    {
      id: parseInt(id),
      locale: router.locale?.toUpperCase() as AE_Language | undefined,
    },
    {
      cacheTime: ONE_DAY_IN_SECONDS,
      keepPreviousData: true,
      onSettled(data) {
        if (data?.data) {
          if (data.data.productImages[0])
            setShowImage(data.data.productImages[0]);
          if (
            data.data.shipping?.carriers &&
            data.data.shipping.carriers.length > 0
          )
            setSelectedShipping(data.data.shipping?.carriers[0]);
        } else
          setMessage({
            type: "error",
            text: `Product details [${id}] fetch error.`,
          });
      },
    },
  );

  const shipping = api.aliexpress.ds.shipping.useQuery(
    {
      id: parseInt(id),
      quantity,
      sku: product.data?.data?.properties[0]?.id,
    },
    {
      cacheTime: ONE_DAY_IN_SECONDS,
      keepPreviousData: true,
      onSettled(data, error) {
        if (error)
          setMessage({
            type: "error",
            text: `Product shipping details [${id}] fetch error.`,
          });
        if (data && !data.success) {
          if (
            data.error ===
              API_RESPONSE_MESSAGES.AE_DS_PRODUCT_SHIPPING_SKU_ID_REQUIRED &&
            product.data?.data?.properties[0]?.id
          ) {
            void shipping.refetch();
          } else setMessage({ type: "error", text: data.error ?? "" });
        }

        if (data?.data?.carriers && !product.data?.data?.shipping) {
          setSelectedShipping(data.data.carriers[0]);
        }
      },
    },
  );

  // an array of the selected properties
  const [selectedProperties, setSelectedProperties] = useState<
    IProductProperty[]
  >([]);
  // selecting one of all the product's properties will result in a selected variation
  const [selectedVariation, setSelectedVariation] =
    useState<SelectedVariation>();
  const setSelectedVariationCallback = useCallback(() => {
    if (
      product.data?.data?.hasVariations &&
      product.data.data.variations &&
      selectedProperties
    ) {
      const selected = select_product_variation(
        product.data?.data.variations,
        selectedProperties,
        quantity,
        product.data?.data.productImages[0] ?? "",
      ) as SelectedVariation | undefined;
      setSelectedVariation(selected);
    }
  }, [product.data, quantity, selectedProperties]);
  useEffect(() => {
    setSelectedVariationCallback();
  }, [setSelectedVariationCallback]);

  const similarProductsQuery = api.aliexpress.affiliate.smartMatch.useQuery(
    {
      product_id: id,
      target_language: router.locale?.toUpperCase() as AE_Language | undefined,
    },
    { cacheTime: ONE_DAY_IN_SECONDS, keepPreviousData: true },
  );

  const t = useTranslations("AliexpressPage");

  return (
    <>
      <Head>
        <title>{`${
          product.data?.data
            ? product.data?.data.title.substring(0, 30) + "..."
            : "Product"
        } | Aliexpress | ${APP_NAME}`}</title>
      </Head>
      {product.isLoading && (
        <div className="flex w-full items-center justify-center">
          <Loading size="large" />
        </div>
      )}
      {product.data?.data && (
        <>
          <section className="body-font">
            <div className="container mx-auto px-5 py-10">
              <div className={`mx-auto flex flex-wrap lg:w-4/5`}>
                <ProductImage
                  product={product.data?.data}
                  showImage={showImage}
                  setShowImage={setShowImage}
                />
                <div
                  className={`mt-6 w-full lg:mt-0 lg:w-1/2 lg:py-6 lg:pl-10`}
                >
                  <h2 className={`font-mono text-sm tracking-widest`}>
                    {product.data?.data.attributes[0]?.value.name}
                  </h2>
                  <h1 className="mb-1 text-xl font-medium">
                    {product.data?.data.title}
                  </h1>
                  <ProductReviews product={product.data?.data} />
                  {product.data?.data?.productCategory?.name && (
                    <p className="font-mono leading-relaxed">
                      {t("category")}: {product.data?.data.productCategory.name}
                    </p>
                  )}
                  <div className="mb-5 mt-6 pb-5">
                    {product.data?.data.properties.map((property) => (
                      <ProductProperty
                        key={property.name}
                        property={property}
                        setShowImage={setShowImage}
                        selectedProperties={selectedProperties}
                        setSelectedProperties={setSelectedProperties}
                      />
                    ))}
                    <ProductQuantity
                      product={product.data?.data}
                      quantity={quantity}
                      setQuantity={setQuantity}
                      selectedVariation={selectedVariation}
                    />
                  </div>
                  <ProductPrice
                    product={product.data?.data}
                    selectedVariation={selectedVariation}
                  />
                  {product.data?.data.shipping && (
                    <ProductShipping
                      shipping={product.data?.data.shipping}
                      setSelectedShipping={setSelectedShipping}
                    />
                  )}
                  {!product.data?.data.shipping && shipping.data?.data && (
                    <ProductShipping
                      shipping={shipping.data?.data}
                      setSelectedShipping={setSelectedShipping}
                    />
                  )}
                  <div className="mt-4 flex justify-end space-x-2">
                    <BuyProduct
                      product={product.data?.data}
                      selectedShipping={selectedShipping}
                      selectedVariation={selectedVariation}
                    />
                    <AddToCart
                      product={product.data?.data}
                      selectedShipping={selectedShipping}
                      selectedVariation={selectedVariation}
                    />
                    <AddToWishlist product={product.data?.data} />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <ProductFeatures product={product.data?.data} />

          <Title title={t("similarProducts")} center={true} />
          {similarProductsQuery.isLoading && <SkeletonProductsColumn />}
          {similarProductsQuery.isFetched &&
            similarProductsQuery?.data?.data?.items &&
            similarProductsQuery.data.data.items.length > 0 && (
              <>
                <div className="mx-2 my-6 grid grid-flow-row-dense grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-7">
                  {similarProductsQuery.data.data.items.map(
                    (similarproduct) => (
                      <ProductCard
                        product={similarproduct}
                        key={similarproduct.productId}
                      />
                    ),
                  )}
                </div>
              </>
            )}
        </>
      )}
    </>
  );
};
