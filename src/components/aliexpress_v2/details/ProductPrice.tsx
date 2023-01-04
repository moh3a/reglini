import { AEProductPrice } from "@reglini-types/index";
import { SelectedVariation } from "../ProductDetails";

interface ProductPriceProps {
  price: AEProductPrice;
  selectedVariation?: SelectedVariation;
}

const ProductPrice = ({ price, selectedVariation }: ProductPriceProps) => {
  return (
    <div className="mt-6 flex justify-center items-center">
      {selectedVariation && selectedVariation.id ? (
        price.hasDiscount && price.discount && selectedVariation.sku_price ? (
          <div className="flex flex-col justify-center items-center border-aliexpress bg-aliexpress text-white  py-2 px-6 text-xl font-bold">
            <div>{selectedVariation.offer_sale_price} $</div>
            <div>
              <span className="line-through mr-2">
                {selectedVariation.sku_price} $
              </span>{" "}
              -{price.discount}%
            </div>
          </div>
        ) : (
          <div className="border-aliexpress bg-aliexpress text-white py-2 px-6 text-xl font-bold">
            {selectedVariation.sku_price} $
          </div>
        )
      ) : price.hasDiscount && price.discount && price.discountedPrice ? (
        <div className="flex flex-col justify-center items-center border-aliexpress bg-aliexpress text-white  py-2 px-6 text-xl font-bold">
          <div>
            <span>
              {price.originalPrice.min === price.originalPrice.max ? (
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
        <div className="border-aliexpress bg-aliexpress text-white py-2 px-6 text-xl font-bold">
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
