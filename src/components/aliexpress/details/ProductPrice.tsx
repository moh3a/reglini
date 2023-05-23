import { useTranslations } from "next-intl";

import { PADDING, ROUNDED, SHADOW } from "@config/design";
import { ZAE_Product } from "@reglini-types/zapiex";
import { GetPrice } from "@utils/index";
import { useFinance } from "@utils/store";
import { SelectedVariation } from "@components/aliexpress/ProductDetails";

interface ProductPriceProps {
  product: ZAE_Product;
  selectedVariation?: SelectedVariation;
}

const ProductPrice = ({ product, selectedVariation }: ProductPriceProps) => {
  const { euro, commission } = useFinance();
  const t = useTranslations("AliexpressPage");
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
                {t("price", {
                  price: GetPrice(
                    euro ?? 0,
                    commission ?? 0,
                    selectedVariation.price.app.discountedPrice.value
                  ),
                })}
              </div>
              <div className="text-xs lg:text-sm">
                <span className="line-through mr-4">
                  {t("price", {
                    price: GetPrice(
                      euro ?? 0,
                      commission ?? 0,
                      selectedVariation.price.app.originalPrice.value
                    ),
                  })}
                </span>{" "}
                {selectedVariation.price.app.discountPercentage}% off
              </div>
            </div>
          ) : (
            <>
              {t("price", {
                price: GetPrice(
                  euro ?? 0,
                  commission ?? 0,
                  selectedVariation.price.app?.originalPrice.value
                ),
              })}
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
                {t("price", {
                  price: GetPrice(
                    euro ?? 0,
                    commission ?? 0,
                    product.price.app.discountedPrice.value
                  ),
                })}
              </div>
              <div className="text-xs lg:text-sm">
                <span className="line-through mr-4">
                  {t("price", {
                    price: GetPrice(
                      euro ?? 0,
                      commission ?? 0,
                      product.price.app.originalPrice.value
                    ),
                  })}
                </span>{" "}
                {product.price.app.discountPercentage}% off
              </div>
            </div>
          ) : (
            <>
              {t("price", {
                price: GetPrice(
                  euro ?? 0,
                  commission ?? 0,
                  product.price.app.originalPrice.value
                ),
              })}
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
                {t("price", {
                  price: GetPrice(
                    euro ?? 0,
                    commission ?? 0,
                    product.priceSummary.app.discountedPrice.min.value
                  ),
                })}{" "}
                -{" "}
                {t("price", {
                  price: GetPrice(
                    euro ?? 0,
                    commission ?? 0,
                    product.priceSummary.app.discountedPrice.max.value
                  ),
                })}
              </div>
              <div className="text-xs lg:text-sm">
                <span className="line-through mr-4">
                  {t("price", {
                    price: GetPrice(
                      euro ?? 0,
                      commission ?? 0,
                      product.priceSummary.app.originalPrice.min.value
                    ),
                  })}{" "}
                  -{" "}
                  {t("price", {
                    price: GetPrice(
                      euro ?? 0,
                      commission ?? 0,
                      product.priceSummary.app.originalPrice.max.value
                    ),
                  })}
                </span>{" "}
                {product.priceSummary.app.discountPercentage}% off
              </div>
            </div>
          ) : (
            <>
              {t("price", {
                price: GetPrice(
                  euro ?? 0,
                  commission ?? 0,
                  product.priceSummary.app.originalPrice.min.value
                ),
              })}{" "}
              -{" "}
              {t("price", {
                price: GetPrice(
                  euro ?? 0,
                  commission ?? 0,
                  product.priceSummary.app.originalPrice.max.value
                ),
              })}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPrice;
