import { PADDING, ROUNDED, SHADOW } from "@config/design";
import { AEProductPrice } from "@reglini-types/index";
import { GetPrice } from "@utils/index";
import { useFinance } from "@utils/store";
import { useTranslations } from "next-intl";
import { SelectedVariation } from "../ProductDetails";

interface ProductPriceProps {
  price: AEProductPrice;
  selectedVariation?: SelectedVariation;
}

const ProductPrice = ({ price, selectedVariation }: ProductPriceProps) => {
  const t = useTranslations("AliexpressPage");
  const { usd, commission } = useFinance();
  return (
    <div className="flex justify-center mt-2 title-font font-medium text-xl">
      {selectedVariation && selectedVariation.id ? (
        price.hasDiscount && price.discount && selectedVariation.sku_price ? (
          <div
            className={`bg-aliexpress hover:bg-red-500 text-center font-bold text-white ${PADDING} ${ROUNDED} ${SHADOW}`}
          >
            <div>
              {t("price", {
                price: GetPrice(
                  usd ?? 0,
                  commission ?? 0,
                  Number(selectedVariation.offer_sale_price)
                ),
              })}
            </div>
            <div>
              <span className="line-through mr-2">
                {t("price", {
                  price: GetPrice(
                    usd ?? 0,
                    commission ?? 0,
                    Number(selectedVariation.sku_price)
                  ),
                })}
              </span>{" "}
              -{price.discount}%
            </div>
          </div>
        ) : (
          <>{selectedVariation.sku_price} $</>
        )
      ) : price.hasDiscount && price.discount && price.discountedPrice ? (
        <div
          className={`bg-aliexpress hover:bg-red-500 text-center font-bold text-white ${PADDING} ${ROUNDED} ${SHADOW}`}
        >
          <div>
            <span>
              {price.discountedPrice.min === price.discountedPrice.max ? (
                t("price", {
                  price: GetPrice(
                    usd ?? 0,
                    commission ?? 0,
                    price.discountedPrice.min
                  ),
                })
              ) : (
                <>
                  {t("price", {
                    price: GetPrice(
                      usd ?? 0,
                      commission ?? 0,
                      price.discountedPrice.min
                    ),
                  })}{" "}
                  -{" "}
                  {t("price", {
                    price: GetPrice(
                      usd ?? 0,
                      commission ?? 0,
                      price.discountedPrice.max
                    ),
                  })}
                </>
              )}
            </span>
          </div>
          <div>
            <span className="line-through mr-2">
              <span>
                {price.originalPrice.min === price.originalPrice.max ? (
                  t("price", {
                    price: GetPrice(
                      usd ?? 0,
                      commission ?? 0,
                      price.originalPrice.min
                    ),
                  })
                ) : (
                  <>
                    {t("price", {
                      price: GetPrice(
                        usd ?? 0,
                        commission ?? 0,
                        price.originalPrice.min
                      ),
                    })}{" "}
                    -{" "}
                    {t("price", {
                      price: GetPrice(
                        usd ?? 0,
                        commission ?? 0,
                        price.originalPrice.max
                      ),
                    })}
                  </>
                )}
              </span>
            </span>{" "}
            -{price.discount}%
          </div>
        </div>
      ) : (
        <div
          className={`bg-aliexpress hover:bg-red-500 text-center font-bold text-white ${PADDING} ${ROUNDED} ${SHADOW}`}
        >
          <span>
            {price.originalPrice.min === price.originalPrice.max ? (
              t("price", {
                price: GetPrice(
                  usd ?? 0,
                  commission ?? 0,
                  price.originalPrice.min
                ),
              })
            ) : (
              <>
                {t("price", {
                  price: GetPrice(
                    usd ?? 0,
                    commission ?? 0,
                    price.originalPrice.min
                  ),
                })}{" "}
                -{" "}
                {t("price", {
                  price: GetPrice(
                    usd ?? 0,
                    commission ?? 0,
                    price.originalPrice.max
                  ),
                })}
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductPrice;
