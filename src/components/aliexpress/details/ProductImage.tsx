/* eslint-disable @next/next/no-img-element */
import type { Dispatch, SetStateAction } from "react";

import { ROUNDED, SHADOW } from "~/config/design";
import type { RAE_Product } from "~/types/ae/rae";

interface ProductImageProps {
  product: RAE_Product;
  showImage: string;
  setShowImage: Dispatch<SetStateAction<string>>;
}

export const ProductImage = ({
  product,
  showImage,
  setShowImage,
}: ProductImageProps) => {
  return (
    <div className="mt-6 w-full lg:mt-0 lg:w-1/2 lg:py-6 lg:pl-10">
      <div className="mb-4">
        <img
          src={showImage}
          alt="product image"
          className={ROUNDED + " " + SHADOW}
        />
      </div>
      <div className="flex flex-wrap items-center">
        {product.productImages.map((image) => {
          return (
            <div
              key={image}
              onClick={() => setShowImage(image)}
              className={`ml-2 cursor-pointer border-2 border-gray-300 p-1 text-center hover:border-aliexpress focus:outline-none ${ROUNDED}`}
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
