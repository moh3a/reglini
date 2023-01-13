/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

import { ZAE_Product } from "@reglini-types/zapiex";
import { useTranslations } from "next-intl";

const StoreInfo = ({ product }: { product: ZAE_Product }) => {
  const t = useTranslations("AliexpressPage.store");
  return (
    <>
      {product.sellerDetails && (
        <Link
          href={product.sellerDetails.sellerDetailsUrl}
          target="_blank"
          rel="noreferrer"
        >
          <h3 className="font-bold text-sm">
            <img
              className="h-10 mr-1 inline"
              src="/aliexpress-ar21.svg"
              alt="aliexpress logo"
            />
            <span>{t("title")}</span>
            <ArrowTopRightOnSquareIcon
              className="w-5 h-5 inline ml-2 relative bottom-1"
              aria-hidden="true"
            />
          </h3>
          <p className="font-bold text-lg">{product.seller.storeName}</p>
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
export default StoreInfo;
