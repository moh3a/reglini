/* eslint-disable @next/next/no-img-element */
import { Dispatch, SetStateAction } from "react";

import { ROUNDED, SHADOW } from "@config/design";
import { ZAE_Product } from "@config/zapiex";

interface ProductImageProps {
  product: ZAE_Product;
  showImage: string;
  setShowImage: Dispatch<SetStateAction<string>>;
}

const ProductImage = ({
  product,
  showImage,
  setShowImage,
}: ProductImageProps) => {
  return (
    <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
      <div className="mb-4">
        <img
          src={showImage}
          alt="product image"
          className={ROUNDED + " " + SHADOW}
        />
      </div>
      <div className="flex items-center flex-wrap">
        {product.productImages.map((image) => {
          return (
            <div
              key={image}
              onClick={() => setShowImage(image)}
              className={`ml-2 p-1 border-2 text-center border-gray-300 hover:border-aliexpress focus:outline-none cursor-pointer ${ROUNDED}`}
            >
              <div className="h-10 w-10">
                <img
                  className={`h-10 w-10 ${ROUNDED}`}
                  src={image}
                  alt={product.title}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ProductImage;
