/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import type { RAE_Product } from "~/types/ae/rae";

export const StoreInfo = ({ product }: { product: RAE_Product }) => {
  const t = useTranslations("AliexpressPage.store");
  return (
    <>
      {product.sellerDetails && (
        <Link
          href={product.sellerDetails.sellerDetailsUrl}
          target="_blank"
          rel="noreferrer"
        >
          <h3 className="text-sm font-bold">
            <img
              className="mr-1 inline h-10"
              src="/aliexpress-ar21.svg"
              alt="aliexpress logo"
            />
            <span>{t("title")}</span>
            <ArrowTopRightOnSquareIcon
              className="relative bottom-1 ml-2 inline h-5 w-5"
              aria-hidden="true"
            />
          </h3>
          <p className="text-lg font-bold">{product.seller.storeName}</p>
          <div className="text-xs">
            <p>
              {t("communication")}:{" "}
              {
                product.sellerDetails.detailedRatings.communication.rating
                  .percentage
              }
            </p>
            <p>
              {t("item")}:{" "}
              {
                product.sellerDetails.detailedRatings.itemAsDescribed.rating
                  .percentage
              }
            </p>
            <p>
              {t("speed")}:{" "}
              {
                product.sellerDetails.detailedRatings.shippingSpeed.rating
                  .percentage
              }
            </p>
          </div>
        </Link>
      )}
    </>
  );
};
