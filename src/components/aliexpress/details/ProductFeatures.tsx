/* eslint-disable @next/next/no-img-element */
import { type ReactNode, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { PADDING, ROUNDED, SHADOW } from "~/config/design";
import type { ZAE_Product, ZAE_ProductAttribute } from "~/types/zapiex";
import { StoreInfo } from "~/components/aliexpress/details";

const Item = ({ title, children }: { title: string; children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`my-2 ${PADDING} ${ROUNDED} ${SHADOW}`}>
      <button
        type="button"
        aria-label="Open item"
        title="Open item"
        className="flex w-full items-center justify-between p-2 focus:outline-none md:p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <div className="flex h-6 w-6 items-center justify-center rounded-full border">
          <svg
            viewBox="0 0 24 24"
            className={`w-3 transition-transform duration-200 ${
              isOpen ? "rotate-180 transform" : ""
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
        <div className="p-2 pt-0 md:p-4">
          <div>{children}</div>
        </div>
      )}
    </div>
  );
};

export function ProductFeatures({ product }: { product: ZAE_Product }) {
  const [attributes, setAttributes] = useState([
    { id: "", name: "", value: [""] },
  ]);

  useEffect(() => {
    const att: (Omit<ZAE_ProductAttribute, "value"> & { value: string[] })[] =
      [];
    if (product.hasAttributes) {
      product.attributes.map((attribute) => {
        const index = att.findIndex((x) => x.id === attribute.id);
        if (index === -1) {
          att.push({
            id: attribute.id,
            name: attribute.name,
            value: [attribute.value.name],
          });
        } else {
          att[index]?.value.push(attribute.value.name);
        }
      });
      setAttributes(att);
    }
  }, [product]);
  const t = useTranslations("AliexpressPage.features");

  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div>
          <Item title={t("productSpecs")}>
            <dl className="my-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
              {attributes?.map((attribute) => {
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

          <Item title={t("sellerDetails")}>
            <StoreInfo product={product} />
          </Item>

          {product.htmlDescription && (
            <Item title={t("productDesc")}>
              <div
                dangerouslySetInnerHTML={{ __html: product.htmlDescription }}
              />
            </Item>
          )}
        </div>
      </div>
    </div>
  );
}
