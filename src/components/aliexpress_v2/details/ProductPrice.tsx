import { PADDING, ROUNDED, SHADOW } from "@config/design";
import { AEProductPrice } from "@reglini-types/index";
import { SelectedVariation } from "../ProductDetails";

interface ProductPriceProps {
  price: AEProductPrice;
  selectedVariation?: SelectedVariation;
}

const ProductPrice = ({ price, selectedVariation }: ProductPriceProps) => {
  return (
    <div className="flex justify-center mt-2 title-font font-medium text-xl">
      {selectedVariation && selectedVariation.id ? (
        price.hasDiscount && price.discount && selectedVariation.sku_price ? (
          <div
            className={`bg-aliexpress hover:bg-red-500 text-center font-bold text-white ${PADDING} ${ROUNDED} ${SHADOW}`}
          >
            <div>{selectedVariation.offer_sale_price} $</div>
            <div>
              <span className="line-through mr-2">
                {selectedVariation.sku_price} $
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
                price.discountedPrice.min
              ) : (
                <>
                  {price.discountedPrice.min} - {price.discountedPrice.max}
                </>
              )}
            </span>{" "}
            $
          </div>
          <div>
            <span className="line-through mr-2">
              <span>
                {price.originalPrice.min === price.originalPrice.max ? (
                  price.originalPrice.min
                ) : (
                  <>
                    {price.originalPrice.min} - {price.originalPrice.max}
                  </>
                )}
              </span>{" "}
              $
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
              price.originalPrice.min
            ) : (
              <>
                {price.originalPrice.min} - {price.originalPrice.max}
              </>
            )}
          </span>{" "}
          $
        </div>
      )}
    </div>
  );
};

export default ProductPrice;
