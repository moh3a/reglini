/* eslint-disable @next/next/no-img-element */
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { ZAE_Product } from "@config/zapiex";
import Link from "next/link";

const StoreInfo = ({ product }: { product: ZAE_Product }) => {
  return (
    <>
      {product.sellerDetails && (
        <Link
          href={product.sellerDetails.sellerDetailsUrl}
          // href={`https://aliexpress.com/store/${product.sellerDetails.sellerDetailsUrl}`}
          target="_blank"
          rel="noreferrer"
        >
          <h3 className="font-bold text-sm">
            <img
              className="h-10 mr-1 inline"
              src="/aliexpress-ar21.svg"
              alt="aliexpress logo"
            />
            <span>Store Info</span>
            <ArrowTopRightOnSquareIcon
              className="w-5 h-5 inline ml-2 relative bottom-1"
              aria-hidden="true"
            />
          </h3>
          <p className="font-bold text-lg">{product.seller.storeName}</p>
          <div className="text-xs">
            <p>
              Communication Rating:{" "}
              {
                product.sellerDetails.detailedRatings.communication.rating
                  .percentage
              }
            </p>
            <p>
              Items as Described Rating:{" "}
              {
                product.sellerDetails.detailedRatings.itemAsDescribed.rating
                  .percentage
              }
            </p>
            <p>
              Shipping Speed Rating:{" "}
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
