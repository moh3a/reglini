/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

import { DS_ProductAPI_Product_Details } from "@reglini-types/ae";

const StoreInfo = ({ product }: { product: DS_ProductAPI_Product_Details }) => {
  return (
    <>
      {product.store_info && (
        <Link
          href={`https://aliexpress.com/store/${product.store_info.store_id}`}
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
          <p className="font-bold text-lg">{product.store_info.store_name}</p>
          <div className="text-xs">
            <p>
              Communication Rating: {product.store_info.communication_rating}
            </p>
            <p>
              Items as Described Rating:{" "}
              {product.store_info.item_as_descriped_rating}
            </p>
            <p>
              Shipping Speed Rating:{product.store_info.shipping_speed_rating}
            </p>
          </div>
        </Link>
      )}
    </>
  );
};
export default StoreInfo;
