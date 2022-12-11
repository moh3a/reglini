import { PADDING, ROUNDED, SHADOW } from "@config/design";
import { ZAE_Product } from "@config/zapiex";
import { SelectedVariation } from "../ProductDetails";

interface ProductPriceProps {
  product: ZAE_Product;
  selectedVariation?: SelectedVariation;
}

const ProductPrice = ({ product, selectedVariation }: ProductPriceProps) => {
  "€";

  return (
    <>
      <div className="flex justify-center mt-2 title-font font-medium text-xl">
        {selectedVariation && selectedVariation.sku ? (
          <>
            {selectedVariation.price.app.hasDiscount ? (
              <div
                className={`bg-aliexpress hover:bg-red-500 text-center font-bold text-white ${PADDING} ${ROUNDED} ${SHADOW}`}
              >
                <div>{selectedVariation.price.app.discountedPrice.value} €</div>
                <div className="text-xs lg:text-sm">
                  <span className="line-through mr-4">
                    {selectedVariation.price.app.originalPrice.value}
                  </span>{" "}
                  {selectedVariation.price.app.discountPercentage}% off
                </div>
              </div>
            ) : (
              <>{selectedVariation.price.app.originalPrice.value} €</>
            )}
          </>
        ) : product.hasSinglePrice ? (
          <>
            {product.price.app.hasDiscount ? (
              <div
                className={`bg-aliexpress hover:bg-red-500 text-center font-bold text-white ${PADDING} ${ROUNDED} ${SHADOW}`}
              >
                <div>{product.price.app.discountedPrice.value} €</div>
                <div className="text-xs lg:text-sm">
                  <span className="line-through mr-4">
                    {product.price.app.originalPrice.value} €
                  </span>{" "}
                  {product.price.app.discountPercentage}% off
                </div>
              </div>
            ) : (
              <>{product.price.app.originalPrice.value} €</>
            )}
          </>
        ) : (
          <>
            {product.priceSummary.app.hasDiscount ? (
              <div
                className={`bg-aliexpress hover:bg-red-500 text-center font-bold text-white ${PADDING} ${ROUNDED} ${SHADOW}`}
              >
                <div>
                  {product.priceSummary.app.discountedPrice.min.value} € -{" "}
                  {product.priceSummary.app.discountedPrice.max.value} €
                </div>
                <div className="text-xs lg:text-sm">
                  <span className="line-through mr-4">
                    {product.priceSummary.app.originalPrice.min.value} € -{" "}
                    {product.priceSummary.app.originalPrice.max.value} €
                  </span>{" "}
                  {product.priceSummary.app.discountPercentage}% off
                </div>
              </div>
            ) : (
              <>
                {product.priceSummary.app.originalPrice.min.value} € -{" "}
                {product.priceSummary.app.originalPrice.max.value} €
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ProductPrice;
