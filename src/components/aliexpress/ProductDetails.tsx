import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useTranslations } from "next-intl";

import type { ZAE_ProductShippingCarrier } from "@reglini-types/zapiex";
import type {
  IMessage,
  ProductProperty as IProductProperty,
  SelectedVariation,
} from "@reglini-types/index";
import { Loading, Banner } from "@components/shared";
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
} from "@components/aliexpress/details";
import { trpc } from "@utils/trpc";
import { APP_NAME } from "@config/general";
import { select_product_variation } from "@utils/index";

export const ProductDetails = ({ id }: { id: string }) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [showImage, setShowImage] = useState("/placeholder.png");
  const [selectedShipping, setSelectedShipping] = useState<
    ZAE_ProductShippingCarrier | undefined
  >();

  const product = trpc.aliexpress.ds.product.useQuery(
    {
      id: parseInt(id),
      locale: router.locale?.toUpperCase(),
    },
    {
      onSettled(data, error) {
        if (error)
          setMessage({
            type: "error",
            text: `Product details [${id}] fetch error.`,
          });
        if (data && !data.success)
          setMessage({ type: "error", text: data.error });

        if (data && data.data) {
          setShowImage(data.data.productImages[0]);
          if (
            data.data.shipping &&
            data.data.shipping.carriers &&
            data.data.shipping.carriers.length > 0
          )
            setSelectedShipping(data.data.shipping?.carriers![0]);
        }
      },
    }
  );

  const shipping = trpc.aliexpress.ds.shipping.useQuery(
    {
      id: parseInt(id),
      quantity,
    },
    {
      onSettled(data, error) {
        if (error)
          setMessage({
            type: "error",
            text: `Product shipping details [${id}] fetch error.`,
          });
        if (data && !data.success)
          setMessage({ type: "error", text: data.error });

        if (
          data &&
          data.data &&
          data.data.carriers &&
          !product.data?.data?.shipping
        ) {
          setSelectedShipping(data.data.carriers[0]);
        }
      },
    }
  );

  const [message, setMessage] = useState<IMessage>();

  // an array of the selected properties
  const [selectedProperties, setSelectedProperties] = useState<
    IProductProperty[]
  >([]);
  // selecting one of all the product's properties will result in a selected variation
  const [selectedVariation, setSelectedVariation] =
    useState<SelectedVariation>();
  const setSelectedVariationCallback = useCallback(() => {
    if (
      product.data &&
      product.data.data &&
      product.data.data.hasVariations &&
      product.data.data.variations &&
      selectedProperties
    ) {
      const selected = select_product_variation(
        product.data?.data.variations,
        selectedProperties,
        quantity,
        product.data?.data.productImages[0]
      ) as SelectedVariation | undefined;
      setSelectedVariation(selected);
    }
  }, [product.data, quantity, selectedProperties]);
  useEffect(() => {
    setSelectedVariationCallback();
  }, [setSelectedVariationCallback]);

  const t = useTranslations("AliexpressPage");

  return (
    <>
      <Head>
        <title>{`${
          product.data && product.data?.data
            ? product.data?.data.title.substring(0, 30) + "..."
            : "Product"
        } | Aliexpress | ${APP_NAME}`}</title>
      </Head>
      {message?.type && <Banner type={message?.type} message={message?.text} />}
      {product.isLoading && (
        <div className="w-full flex justify-center items-center">
          <Loading size="large" />
        </div>
      )}
      {product.data && product.data?.data && (
        <>
          <section className="body-font">
            <div className="container px-5 py-10 mx-auto">
              <div className={`lg:w-4/5 mx-auto flex flex-wrap`}>
                <ProductImage
                  product={product.data?.data}
                  showImage={showImage}
                  setShowImage={setShowImage}
                />
                <div
                  className={`lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0`}
                >
                  <h2 className={`text-sm font-mono tracking-widest`}>
                    {product.data?.data.attributes[0].value.name}
                  </h2>
                  <h1 className="text-xl font-medium mb-1">
                    {product.data?.data.title}
                  </h1>
                  <ProductReviews product={product.data?.data} />
                  {product.data?.data.productCategory &&
                    product.data?.data.productCategory.name && (
                      <p className="leading-relaxed font-mono">
                        {t("category")}:{" "}
                        {product.data?.data.productCategory.name}
                      </p>
                    )}
                  <div className="mt-6 pb-5 mb-5">
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
                      setMessage={setMessage}
                    />
                    <AddToCart
                      product={product.data?.data}
                      setMessage={setMessage}
                      selectedShipping={selectedShipping}
                      selectedVariation={selectedVariation}
                    />
                    <AddToWishlist
                      product={product.data?.data}
                      setMessage={setMessage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <ProductFeatures product={product.data?.data} />
        </>
      )}
    </>
  );
};
