import { PADDING, ROUNDED, SHADOW } from "@config/design";
import { AEProductPrice } from "@reglini-types/index";
import { GetPrice } from "@utils/index";
import { useFinance } from "@utils/store";
import { SelectedVariation } from "../ProductDetails";

interface ProductPriceProps {
  price: AEProductPrice;
  selectedVariation?: SelectedVariation;
}

const ProductPrice = ({ price, selectedVariation }: ProductPriceProps) => {
  const { usd, commission } = useFinance();
  return (
    <div className="flex justify-center mt-2 title-font font-medium text-xl">
      {selectedVariation && selectedVariation.id ? (
        price.hasDiscount && price.discount && selectedVariation.sku_price ? (
          <div
            className={`bg-aliexpress hover:bg-red-500 text-center font-bold text-white ${PADDING} ${ROUNDED} ${SHADOW}`}
          >
            <div>
              {GetPrice(
                usd ?? 0,
                commission ?? 0,
                Number(selectedVariation.offer_sale_price)
              )}{" "}
              DZD
            </div>
            <div>
              <span className="line-through mr-2">
                {GetPrice(
                  usd ?? 0,
                  commission ?? 0,
                  Number(selectedVariation.sku_price)
                )}{" "}
                DZD
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
                GetPrice(usd ?? 0, commission ?? 0, price.discountedPrice.min)
              ) : (
                <>
                  {GetPrice(
                    usd ?? 0,
                    commission ?? 0,
                    price.discountedPrice.min
                  )}{" "}
                  -{" "}
                  {GetPrice(
                    usd ?? 0,
                    commission ?? 0,
                    price.discountedPrice.max
                  )}
                </>
              )}
            </span>{" "}
            DZD
          </div>
          <div>
            <span className="line-through mr-2">
              <span>
                {price.originalPrice.min === price.originalPrice.max ? (
                  GetPrice(usd ?? 0, commission ?? 0, price.originalPrice.min)
                ) : (
                  <>
                    {GetPrice(
                      usd ?? 0,
                      commission ?? 0,
                      price.originalPrice.min
                    )}{" "}
                    -{" "}
                    {GetPrice(
                      usd ?? 0,
                      commission ?? 0,
                      price.originalPrice.max
                    )}
                  </>
                )}
              </span>{" "}
              DZD
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
              GetPrice(usd ?? 0, commission ?? 0, price.originalPrice.min)
            ) : (
              <>
                {GetPrice(usd ?? 0, commission ?? 0, price.originalPrice.min)} -{" "}
                {GetPrice(usd ?? 0, commission ?? 0, price.originalPrice.max)}
              </>
            )}
          </span>{" "}
          DZD
        </div>
      )}
    </div>
  );
};

export default ProductPrice;
