/* eslint-disable @next/next/no-img-element */
import { useState, Dispatch, SetStateAction } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import { ROUNDED } from "@config/design";
import type { ZAE_ProductProperties } from "@reglini-types/zapiex";
import type { ProductProperty as IProductProperty } from "@reglini-types/index";

interface ProductPropertyProps {
  property: ZAE_ProductProperties;
  setShowImage: Dispatch<SetStateAction<string>>;
  selectedProperties: IProductProperty[];
  setSelectedProperties: Dispatch<SetStateAction<IProductProperty[]>>;
}

export const ProductProperty = ({
  property,
  setShowImage,
  selectedProperties,
  setSelectedProperties,
}: ProductPropertyProps) => {
  const [selectedProperty, setSelectedProperty] = useState<string>("");

  const selectProperty = (value: string) => {
    setSelectedProperty(value);
    setSelectedProperties((properties) => {
      const newprops = properties.filter((p) => p.name !== property.name);
      return [...newprops, { name: property.name, value }];
    });
  };

  const unselectProperty = () => {
    setSelectedProperty("");
    setSelectedProperties((properties) =>
      properties.filter((p) => p.name !== property.name)
    );
  };

  const selectHandler = (value: string) => {
    const isPropertySelected = selectedProperties.find(
      (p) => p.name === property.name && p.value === value
    );
    if (isPropertySelected) unselectProperty();
    else selectProperty(value);
  };

  return (
    <div className="mt-4">
      <div>
        {selectedProperty ? (
          <CheckCircleIcon
            className="h-5 w-5 inline text-success mr-1"
            aria-hidden="true"
          />
        ) : (
          <ExclamationCircleIcon
            className="h-5 w-5 inline text-danger mr-1"
            aria-hidden="true"
          />
        )}
        {property.name} : {selectedProperty}
      </div>

      <div className={`flex flex-wrap`}>
        {property.values.map((value) => (
          <div
            key={value.id}
            className={`${
              selectedProperty === value.name
                ? "border-aliexpress"
                : "border-gray-300"
            } ml-2 p-1 border-2 text-center hover:border-aliexpress focus:outline-none cursor-pointer ${ROUNDED}`}
            onClick={() => selectHandler(value.name)}
          >
            {value.hasImage ? (
              <div
                className={`h-10 w-10 ${ROUNDED}`}
                onClick={() => setShowImage(value.imageUrl ?? "")}
              >
                <img
                  src={value.thumbnailImageUrl}
                  alt={value.name}
                  className={ROUNDED}
                />
              </div>
            ) : (
              value.name
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
