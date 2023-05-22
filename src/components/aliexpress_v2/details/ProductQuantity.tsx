import { Dispatch, SetStateAction } from "react";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import NumberInput from "@components/shared/NumberInput";
import { DS_ProductAPI_Product_Details } from "@reglini-types/ae";
import { SelectedProductVariation } from "@reglini-types/index";

interface ProductQuantityProps {
  product: DS_ProductAPI_Product_Details;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  selectedVariation?: SelectedProductVariation;
}

const ProductQuantity = ({
  product,
  quantity,
  setQuantity,
  selectedVariation,
}: ProductQuantityProps) => {
  const t = useTranslations("AliexpressPage.quantity");
  const stock =
    selectedVariation &&
    typeof selectedVariation.s_k_u_available_stock !== "undefined"
      ? selectedVariation.s_k_u_available_stock
      : product.total_available_stock;

  return (
    <div className={`mt-4`}>
      <div>{t("title")}</div>
      <div className={`flex`}>
        {stock > 0 && (
          <NumberInput
            value={stock < 1 ? 0 : Math.round(quantity)}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            disabled={stock < 1}
            min={1}
            step={1}
            width={90}
          />
        )}
        <span className="relative top-1 ml-2">
          {stock > 0 ? (
            <>
              <CheckCircleIcon
                className="h-5 w-5 inline text-success mr-1"
                aria-hidden="true"
              />
              <span>
                {stock} {product.base_unit} {t("available")}
              </span>
            </>
          ) : (
            <>
              <ExclamationCircleIcon
                className="h-5 w-5 inline text-danger mr-1"
                aria-hidden="true"
              />
              <span className="text-danger">{t("outOfStock")}</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
};

export default ProductQuantity;
