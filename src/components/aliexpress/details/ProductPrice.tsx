import { useTranslations } from "next-intl";

import { PADDING, ROUNDED, SHADOW } from "~/config/design";
import type { RAE_Product } from "~/types/ae/rae";
import { GetPrice } from "~/utils/index";
import { useFinance } from "~/utils/store";
import type { SelectedVariation } from "~/types/index";

interface ProductPriceProps {
  product: RAE_Product;
  selectedVariation?: SelectedVariation;
}

export const ProductPrice = ({
  product,
  selectedVariation,
}: ProductPriceProps) => {
  const { euro, commission } = useFinance();
  const t = useTranslations("AliexpressPage");
  return (
    <div className="title-font mt-2 flex justify-center text-xl font-medium">
      {selectedVariation?.sku && selectedVariation.price.app ? (
        <>
          {selectedVariation.price.app?.hasDiscount ? (
            <div
              className={`bg-aliexpress text-center font-bold text-white hover:bg-red-500 ${PADDING} ${ROUNDED} ${SHADOW}`}
            >
              <div>
                {t("price", {
                  price: GetPrice(
                    euro ?? 0,
                    commission ?? 0,
                    selectedVariation.price.app.discountedPrice.value,
                  ),
                })}
              </div>
              <div className="text-xs lg:text-sm">
                <span className="mr-4 line-through">
                  {t("price", {
                    price: GetPrice(
                      euro ?? 0,
                      commission ?? 0,
                      selectedVariation.price.app.originalPrice.value,
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
                  selectedVariation.price.app?.originalPrice.value,
                ),
              })}
            </>
          )}
        </>
      ) : product.hasSinglePrice && product.price ? (
        <>
          {product.price.app.hasDiscount ? (
            <div
              className={`bg-aliexpress text-center font-bold text-white hover:bg-red-500 ${PADDING} ${ROUNDED} ${SHADOW}`}
            >
              <div>
                {t("price", {
                  price: GetPrice(
                    euro ?? 0,
                    commission ?? 0,
                    product.price.app.discountedPrice.value,
                  ),
                })}
              </div>
              <div className="text-xs lg:text-sm">
                <span className="mr-4 line-through">
                  {t("price", {
                    price: GetPrice(
                      euro ?? 0,
                      commission ?? 0,
                      product.price.app.originalPrice.value,
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
                  product.price.app.originalPrice.value,
                ),
              })}
            </>
          )}
        </>
      ) : (
        !product.hasSinglePrice &&
        product.priceSummary && (
          <>
            {product.priceSummary.app.hasDiscount ? (
              <div
                className={`bg-aliexpress text-center font-bold text-white hover:bg-red-500 ${PADDING} ${ROUNDED} ${SHADOW}`}
              >
                <div>
                  {t("price", {
                    price: GetPrice(
                      euro ?? 0,
                      commission ?? 0,
                      product.priceSummary.app.discountedPrice.min.value,
                    ),
                  })}{" "}
                  -{" "}
                  {t("price", {
                    price: GetPrice(
                      euro ?? 0,
                      commission ?? 0,
                      product.priceSummary.app.discountedPrice.max.value,
                    ),
                  })}
                </div>
                <div className="text-xs lg:text-sm">
                  <span className="mr-4 line-through">
                    {t("price", {
                      price: GetPrice(
                        euro ?? 0,
                        commission ?? 0,
                        product.priceSummary.app.originalPrice.min.value,
                      ),
                    })}{" "}
                    -{" "}
                    {t("price", {
                      price: GetPrice(
                        euro ?? 0,
                        commission ?? 0,
                        product.priceSummary.app.originalPrice.max.value,
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
                    product.priceSummary.app.originalPrice.min.value,
                  ),
                })}{" "}
                -{" "}
                {t("price", {
                  price: GetPrice(
                    euro ?? 0,
                    commission ?? 0,
                    product.priceSummary.app.originalPrice.max.value,
                  ),
                })}
              </>
            )}
          </>
        )
      )}
    </div>
  );
};
