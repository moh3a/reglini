/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import parse from "html-react-parser";

import { PADDING, ROUNDED, SHADOW } from "@config/design";
import StoreInfo from "./StoreInfo";
import { DS_ProductAPI_Product_Details } from "@reglini-types/ae";

const Item = ({ title, children }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`my-2 ${PADDING} ${ROUNDED} ${SHADOW}`}>
      <button
        type="button"
        aria-label="Open item"
        title="Open item"
        className="flex items-center justify-between w-full p-4 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h1 className="text-3xl font-extrabold tracking-tight  sm:text-4xl">
          {title}
        </h1>
        <div className="flex items-center justify-center w-8 h-8 border rounded-full">
          <svg
            viewBox="0 0 24 24"
            className={`w-3 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          >
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeMiterlimit="10"
              points="2,7 12,17 22,7"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="p-4 pt-0">
          <div>{children}</div>
        </div>
      )}
    </div>
  );
};

export default function ProductFeatures({
  product,
}: {
  product: DS_ProductAPI_Product_Details;
}) {
  const [attributes, setAttributes] = useState([
    { id: "", name: "", value: [""] },
  ]);

  useEffect(() => {
    let att: any[] = [];
    if (product.aeop_ae_product_propertys.aeop_ae_product_property) {
      product.aeop_ae_product_propertys.aeop_ae_product_property.map(
        (attribute) => {
          const index = att.findIndex(
            (x: any) => x.id === attribute.attr_name_id.toString()
          );
          if (index === -1) {
            att.push({
              id: attribute.attr_name_id.toString(),
              name: attribute.attr_name,
              value: [attribute.attr_value],
            });
          } else {
            att[index].value.push(attribute.attr_value);
          }
        }
      );
      setAttributes(att);
    }
  }, [product]);

  return (
    <div>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div>
          <Item title="Product Specifications">
            <dl className="my-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
              {attributes &&
                attributes.map((attribute) => {
                  return (
                    <div
                      key={attribute.id}
                      className="border-t border-gray-200 pt-4"
                    >
                      <dt className="font-medium ">{attribute.name}</dt>
                      <dd className="mt-2 text-sm text-gray-600 dark:text-white">
                        {attribute.value.map((va) => (
                          <p key={va}>{va}</p>
                        ))}
                      </dd>
                    </div>
                  );
                })}
            </dl>
          </Item>

          <Item title="Seller Details">
            <StoreInfo product={product} />
          </Item>

          {product.detail && (
            <Item title="Seller's Product Description">
              {parse(product.detail)}
            </Item>
          )}
        </div>
      </div>
    </div>
  );
}
