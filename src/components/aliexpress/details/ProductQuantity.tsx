import type { Dispatch, SetStateAction } from "react";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { NumberInput } from "~/components/shared";
import type { RAE_Product } from "~/types/ae/rae";
import type { SelectedVariation } from "~/types/index";

interface ProductQuantityProps {
  product: RAE_Product;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  selectedVariation?: SelectedVariation;
}

export const ProductQuantity = ({
  product,
  quantity,
  setQuantity,
  selectedVariation,
}: ProductQuantityProps) => {
  const t = useTranslations("AliexpressPage.quantity");
  const stock = selectedVariation?.sku
    ? selectedVariation.stock
    : product.totalStock > 0
    ? product.totalStock
    : 1;

  return (
    <div className={`mt-4`}>
      <div>{t("title")}</div>
      {stock && (
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
                  className="mr-1 inline h-5 w-5 text-success"
                  aria-hidden="true"
                />
                <span>
                  {stock} {product.unitNamePlural} {t("available")}
                </span>
              </>
            ) : (
              <>
                <ExclamationCircleIcon
                  className="mr-1 inline h-5 w-5 text-danger"
                  aria-hidden="true"
                />
                <span className="text-danger">{t("outOfStock")}</span>
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
};
