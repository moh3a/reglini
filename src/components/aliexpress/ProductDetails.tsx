import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { ZAE_Product } from "@reglini-types/zapiex";
import Modal from "@components/shared/Modal";
import Loading from "@components/shared/Loading";
import ProductImage from "./details/ProductImage";
import ProductReviews from "./details/ProductReviews";
import ProductProperty from "./details/ProductProperty";
import ProductQuantity from "./details/ProductQuantity";
import ProductPrice from "./details/ProductPrice";
import ProductShipping from "./details/ProductShipping";
import BuyProduct from "./details/BuyProduct";
import ProductFeatures from "./details/ProductFeatures";
import AddToCart from "./details/AddToCart";
import AddToWishlist from "./details/AddToWishlist";
import { trpc } from "@utils/trpc";

export interface SelectedVariation {
  imageUrl: string;
  price: any;
  properties: any[];
  sku: string;
  thumbnailImageUrl: string;
  quantity?: number | undefined;
  stock?: number | undefined;
}

const ProductDetails = ({ id }: { id: string }) => {
  const router = useRouter();
  const product = trpc.zapiex.product.useQuery(
    {
      id,
      locale: router.locale?.toUpperCase(),
    },
    {
      onSettled(data, error) {
        if (data && data.data) {
          setShowImage(data.data.productImages[0]);
          setSelectedShipping(data.data.shipping.carriers[0]);
        }
      },
    }
  );
  const [message, setMessage] = useState<{
    type?: "success" | "warning" | "error";
    text?: string;
  }>();
  const [isOpen, setIsOpen] = useState(false);

  const [showImage, setShowImage] = useState("");
  const [selectedShipping, setSelectedShipping] =
    useState<ZAE_Product["shipping"]["carriers"]["0"]>();

  const [quantity, setQuantity] = useState(1);
  const [properties, setProperties] = useState([{ name: "", value: "" }]);
  const [variation, setVariation] =
    useState<({ name: string; value: string } | undefined)[]>();

  useEffect(() => {
    if (product.data && product.data.data) {
      if (product.data.data.hasProperties && properties) {
        let inverse = properties.slice().reverse();
        let values = product.data.data.properties.map((prop: any) =>
          inverse.find((property: any) => property.name === prop.name)
        );
        setVariation(values);
      } else if (!product.data.data.hasProperties) {
      }
    }
  }, [product.data, properties]);

  const [selectedVariation, setSelectedVariation] =
    useState<SelectedVariation>();

  useEffect(() => {
    if (product.data && product.data.data) {
      if (product.data.data.hasVariations && variation) {
        let theOne = {
          imageUrl: "",
          price: {},
          properties: [{}],
          sku: "",
          thumbnailImageUrl: "",
        };
        if (product.data.data.variations.length > 1) {
          product.data.data.variations.map((varia: any) => {
            let checking: boolean[] = [];
            varia.properties.map(() => checking.push(false));
            varia.properties.map((prop: any, i: number = 0) => {
              const index =
                variation[0] === undefined
                  ? -2
                  : variation.findIndex((el) => el?.value === prop.value.name);
              if (
                index !== -2 &&
                index !== -1 &&
                variation[index]?.name === prop.name &&
                variation[index]?.value === prop.value.name
              ) {
                checking[i] = true;
              } else {
                checking[i] = false;
              }
              i++;
            });
            if (!checking.includes(false)) theOne = varia;
          });
        } else {
          theOne = product.data.data.variations[0];
        }
        setSelectedVariation({ ...theOne, quantity });
      }
    }
  }, [product.data, variation, quantity]);

  return (
    <>
      {product.isLoading && (
        <div className="w-full flex justify-center items-center">
          <Loading size="large" />
        </div>
      )}
      {product.data && product.data.data && (
        <>
          <section className="body-font">
            {message?.type && (
              <Modal
                title={message.type.toUpperCase()}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              >
                {message.text}
              </Modal>
            )}
            <div className="container px-5 py-10 mx-auto">
              <div className={`lg:w-4/5 mx-auto flex flex-wrap`}>
                <ProductImage
                  product={product.data.data}
                  showImage={showImage}
                  setShowImage={setShowImage}
                />
                <div
                  className={`lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0`}
                >
                  <h2 className={`text-sm font-mono tracking-widest`}>
                    {product.data.data.attributes[0].value.name}
                  </h2>
                  <h1 className="text-xl font-medium mb-1">
                    {product.data.data.title}
                  </h1>
                  <ProductReviews product={product.data.data} />
                  {product.data.data.productCategory &&
                    product.data.data.productCategory.name && (
                      <p className="leading-relaxed font-mono">
                        Category: {product.data.data.productCategory.name}
                      </p>
                    )}
                  <div className="mt-6 pb-5 mb-5">
                    {product.data.data.properties.map((property) => {
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
                      product={product.data.data}
                      quantity={quantity}
                      setQuantity={setQuantity}
                      selectedVariation={selectedVariation}
                    />
                  </div>
                  <ProductPrice
                    product={product.data.data}
                    selectedVariation={selectedVariation}
                  />
                  <ProductShipping
                    product={product.data.data}
                    setSelectedShipping={setSelectedShipping}
                  />
                  <div className="mt-4 flex justify-end space-x-2">
                    <BuyProduct
                      product={product.data.data}
                      selectedShipping={selectedShipping}
                      selectedVariation={selectedVariation}
                      setMessage={setMessage}
                    />
                    <AddToCart
                      product={product.data.data}
                      setMessage={setMessage}
                      selectedShipping={selectedShipping}
                      selectedVariation={selectedVariation}
                    />
                    <AddToWishlist
                      product={product.data.data}
                      setMessage={setMessage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <ProductFeatures product={product.data.data} />
        </>
      )}
    </>
  );
};

export default ProductDetails;
