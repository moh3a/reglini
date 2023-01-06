import { PADDING, ROUNDED, SHADOW } from "@config/design";
import { ZAE_Product } from "@reglini-types/zapiex";
import { GetPrice } from "@utils/index";
import { useFinance } from "@utils/store";
import { SelectedVariation } from "../ProductDetails";

interface ProductPriceProps {
  product: ZAE_Product;
  selectedVariation?: SelectedVariation;
}

const ProductPrice = ({ product, selectedVariation }: ProductPriceProps) => {
  const { euro, commission } = useFinance();
  return (
    <div className="flex justify-center mt-2 title-font font-medium text-xl">
      {selectedVariation &&
      selectedVariation.sku &&
      selectedVariation.price.app ? (
        <>
          {selectedVariation.price.app?.hasDiscount ? (
            <div
              className={`bg-aliexpress hover:bg-red-500 text-center font-bold text-white ${PADDING} ${ROUNDED} ${SHADOW}`}
            >
              <div>
                {GetPrice(
                  euro ?? 0,
                  commission ?? 0,
                  selectedVariation.price.app.discountedPrice.value
                )}{" "}
                DZD
              </div>
              <div className="text-xs lg:text-sm">
                <span className="line-through mr-4">
                  {selectedVariation.price.app.originalPrice.value}
                </span>{" "}
                {selectedVariation.price.app.discountPercentage}% off
              </div>
            </div>
          ) : (
            <>
              {GetPrice(
                euro ?? 0,
                commission ?? 0,
                selectedVariation.price.app?.originalPrice.value
              )}{" "}
              DZD
            </>
          )}
        </>
      ) : product.hasSinglePrice ? (
        <>
          {product.price.app.hasDiscount ? (
            <div
              className={`bg-aliexpress hover:bg-red-500 text-center font-bold text-white ${PADDING} ${ROUNDED} ${SHADOW}`}
            >
              <div>
                {GetPrice(
                  euro ?? 0,
                  commission ?? 0,
                  product.price.app.discountedPrice.value
                )}{" "}
                DZD
              </div>
              <div className="text-xs lg:text-sm">
                <span className="line-through mr-4">
                  {GetPrice(
                    euro ?? 0,
                    commission ?? 0,
                    product.price.app.originalPrice.value
                  )}{" "}
                  DZD
                </span>{" "}
                {product.price.app.discountPercentage}% off
              </div>
            </div>
          ) : (
            <>
              {GetPrice(
                euro ?? 0,
                commission ?? 0,
                product.price.app.originalPrice.value
              )}{" "}
              DZD
            </>
          )}
        </>
      ) : (
        <>
          {product.priceSummary.app.hasDiscount ? (
            <div
              className={`bg-aliexpress hover:bg-red-500 text-center font-bold text-white ${PADDING} ${ROUNDED} ${SHADOW}`}
            >
              <div>
                {GetPrice(
                  euro ?? 0,
                  commission ?? 0,
                  product.priceSummary.app.discountedPrice.min.value
                )}{" "}
                DZD -{" "}
                {GetPrice(
                  euro ?? 0,
                  commission ?? 0,
                  product.priceSummary.app.discountedPrice.max.value
                )}{" "}
                DZD
              </div>
              <div className="text-xs lg:text-sm">
                <span className="line-through mr-4">
                  {GetPrice(
                    euro ?? 0,
                    commission ?? 0,
                    product.priceSummary.app.originalPrice.min.value
                  )}{" "}
                  DZD -{" "}
                  {GetPrice(
                    euro ?? 0,
                    commission ?? 0,
                    product.priceSummary.app.originalPrice.max.value
                  )}{" "}
                  DZD
                </span>{" "}
                {product.priceSummary.app.discountPercentage}% off
              </div>
            </div>
          ) : (
            <>
              {GetPrice(
                euro ?? 0,
                commission ?? 0,
                product.priceSummary.app.originalPrice.min.value
              )}{" "}
              DZD -{" "}
              {GetPrice(
                euro ?? 0,
                commission ?? 0,
                product.priceSummary.app.originalPrice.max.value
              )}{" "}
              DZD
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPrice;
