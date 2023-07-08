import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useTranslations } from "next-intl";

import Modal from "@components/shared/Modal";
import Loading from "@components/shared/Loading";
import ProductImage from "@components/aliexpress_v2/details/ProductImage";
import ProductReviews from "@components/aliexpress_v2/details/ProductReviews";
import ProductProperty from "@components/aliexpress_v2/details/ProductProperty";
import ProductQuantity from "@components/aliexpress_v2/details/ProductQuantity";
import ProductPrice from "@components/aliexpress_v2/details/ProductPrice";
import ProductShipping from "@components/aliexpress_v2/details/ProductShipping";
import BuyProduct from "@components/aliexpress_v2/details/BuyProduct";
import ProductFeatures from "@components/aliexpress_v2/details/ProductFeatures";
import AddToCart from "@components/aliexpress_v2/details/AddToCart";
import AddToWishlist from "@components/aliexpress_v2/details/AddToWishlist";
import { trpc } from "@utils/trpc";
import {
  Affiliate_Categories_Result,
  DS_ShippingAPI_Shipping_Info_Result,
} from "@reglini-types/ae";
import { IMessage, SelectedProductVariation } from "@reglini-types/index";
import { APP_NAME } from "@config/general";

const ProductDetails = ({ id }: { id: number }) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const [showImage, setShowImage] = useState("/placeholder.png");
  const product = trpc.aliexpress.ds.product.useQuery(
    {
      id,
      locale: router.locale?.toUpperCase(),
    },
    {
      onSettled(data, error) {
        if (error || data?.result.currency_code !== "USD")
          router.push(`/aliexpress/v1/product/${id}`);
        if (data && data.result) {
          setShowImage(data.result.image_u_r_ls.split(";")[0]);
        }
      },
    }
  );

  const [selectedShipping, setSelectedShipping] =
    useState<
      DS_ShippingAPI_Shipping_Info_Result["result"]["aeop_freight_calculate_result_for_buyer_d_t_o_list"]["0"]
    >();
  const shippingInfo = trpc.aliexpress.ds.shipping.useQuery(
    { id, quantity },
    {
      onSettled(data) {
        if (
          data &&
          data.result.aeop_freight_calculate_result_for_buyer_d_t_o_list
        ) {
          setSelectedShipping(
            data.result.aeop_freight_calculate_result_for_buyer_d_t_o_list[0]
          );
        }
      },
    }
  );

  const categoryInfo = trpc.aliexpress.affiliate.category.useMutation();
  useEffect(() => {
    if (product.data?.result.category_id)
      categoryInfo.mutate({ category_id: product.data?.result.category_id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.data?.result.category_id]);

  const [message, setMessage] = useState<IMessage>();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (message?.type) setIsOpen(true);
    else setIsOpen(false);
  }, [message?.type]);

  const [properties, setProperties] = useState([{ name: "", value: "" }]);
  const [variation, setVariation] =
    useState<({ name: string; value: string } | undefined)[]>();

  useEffect(() => {
    if (product.data && product.data.properties && properties) {
      let inverse = properties.slice().reverse();
      let values = product.data.properties.map((prop) =>
        inverse.find((property) => property.name === prop.name)
      );
      setVariation(values);
    }
  }, [product.data, properties]);

  const [selectedVariation, setSelectedVariation] =
    useState<SelectedProductVariation>();

  useEffect(() => {
    if (product.data?.result.aeop_ae_product_s_k_us && variation) {
      let imageUrl: string = "";
      let theOne: Partial<SelectedProductVariation> = {};
      if (product.data.result.aeop_ae_product_s_k_us.length === 1) {
        theOne = product.data.result.aeop_ae_product_s_k_us[0];
      } else if (product.data.result.aeop_ae_product_s_k_us.length > 1) {
        product.data.result.aeop_ae_product_s_k_us.map(
          (varia: Partial<SelectedProductVariation>) => {
            let checking: boolean[] = [];
            if (varia.aeop_s_k_u_propertys) {
              varia.aeop_s_k_u_propertys.map((prop, i) => {
                checking.push(false);
                if (variation) {
                  const index =
                    variation[0] === undefined
                      ? -2
                      : variation.findIndex(
                          (el) =>
                            el?.value ===
                            (prop.property_value_definition_name
                              ? prop.property_value_definition_name
                              : prop.sku_property_value)
                        );
                  if (
                    index !== -2 &&
                    index !== -1 &&
                    variation[index]?.name === prop.sku_property_name &&
                    variation[index]?.value ===
                      (prop.property_value_definition_name
                        ? prop.property_value_definition_name
                        : prop.sku_property_value)
                  ) {
                    checking[i] = true;
                  } else {
                    checking[i] = false;
                  }
                  i++;
                }
              });
              if (!checking.includes(false)) {
                const sku_with_image = varia.aeop_s_k_u_propertys.find(
                  (sku) => sku.sku_image && sku.sku_image.length > 0
                );
                if (sku_with_image)
                  imageUrl =
                    sku_with_image.sku_image ??
                    product.data?.result.image_u_r_ls.split(";")[0];
                product.data?.result.image_u_r_ls.split(";")[0];
                theOne = {
                  ...varia,
                  quantity:
                    varia.s_k_u_available_stock &&
                    varia.s_k_u_available_stock > 0
                      ? quantity
                      : 0,
                };
              }
            }
          }
        );
      }
      setSelectedVariation({ ...theOne, imageUrl } as
        | SelectedProductVariation
        | undefined);
    }
  }, [product.data, variation, quantity]);

  const t = useTranslations("AliexpressPage");

  return (
    <>
      <Head>
        <title>{`${
          product.data && product.data.result
            ? product.data.result.subject.substring(0, 30) + "..."
            : "Product"
        } | Aliexpress | ${APP_NAME}`}</title>
      </Head>
      {product.isLoading && (
        <div className="w-full flex justify-center items-center">
          <Loading size="large" />
        </div>
      )}
      {product.data && product.data.result && (
        <>
          <section className="body-font">
            <Modal
              type={message?.type}
              title={message?.type?.toUpperCase()}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            >
              {message?.text}
            </Modal>

            <div className="container px-5 py-10 mx-auto">
              <div className={`lg:w-4/5 mx-auto flex flex-wrap`}>
                <ProductImage
                  product={product.data.result}
                  showImage={showImage}
                  setShowImage={setShowImage}
                />
                <div
                  className={`lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0`}
                >
                  <h2 className={`text-sm font-mono tracking-widest`}>
                    {product.data.result.aeop_ae_product_propertys &&
                      product.data.result.aeop_ae_product_propertys[0]
                        .attr_value}
                  </h2>
                  <h1 className="text-xl font-medium mb-1">
                    {product.data.result.subject}
                  </h1>
                  <ProductReviews product={product.data.result} />
                  {categoryInfo.data ? (
                    <p className="leading-relaxed font-mono">
                      {t("category")}:{" "}
                      {
                        (
                          categoryInfo.data as Affiliate_Categories_Result["resp_result"]["result"]["categories"][0]
                        ).category_name
                      }
                    </p>
                  ) : (
                    <p className="leading-relaxed font-mono">
                      {t("categoryId")}: {product.data.result.category_id}
                    </p>
                  )}
                  <div className="mt-6 pb-5 mb-5">
                    {product.data.properties.map((property) => {
                      return (
                        <ProductProperty
                          key={property.name}
                          property={property}
                          setShowImage={setShowImage}
                          setProperties={setProperties}
                        />
                      );
                    })}
                    <ProductQuantity
                      product={product.data.result}
                      quantity={quantity}
                      setQuantity={setQuantity}
                      selectedVariation={selectedVariation}
                    />
                  </div>
                  <ProductPrice
                    price={product.data.price}
                    selectedVariation={selectedVariation}
                  />
                  {shippingInfo.isLoading && (
                    <div className="w-full flex justify-center items-center">
                      <Loading size="large" />
                    </div>
                  )}
                  {shippingInfo.data &&
                  shippingInfo.data.result &&
                  shippingInfo.data.result
                    .aeop_freight_calculate_result_for_buyer_d_t_o_list ? (
                    <ProductShipping
                      shipping={shippingInfo.data}
                      setSelectedShipping={setSelectedShipping}
                    />
                  ) : (
                    <p className="text-danger text-center uppercase font-mono">
                      {t("shipping.shippingNotAvailable")}
                    </p>
                  )}
                  <div className="mt-4 flex justify-end space-x-2">
                    <BuyProduct
                      product={product.data.result}
                      discount={product.data.price.discount}
                      selectedShipping={selectedShipping}
                      selectedVariation={selectedVariation}
                      setMessage={setMessage}
                    />
                    <AddToCart
                      product={product.data.result}
                      discount={product.data.price.discount}
                      setMessage={setMessage}
                      selectedShipping={selectedShipping}
                      selectedVariation={selectedVariation}
                    />
                    <AddToWishlist
                      product={product.data.result}
                      setMessage={setMessage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <ProductFeatures product={product.data.result} />
        </>
      )}
    </>
  );
};

export default ProductDetails;
