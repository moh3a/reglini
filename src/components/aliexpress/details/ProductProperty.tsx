/* eslint-disable @next/next/no-img-element */
import { useState, type Dispatch, type SetStateAction } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import { ROUNDED } from "~/config/design";
import type { ZAE_ProductProperties } from "~/types/zapiex";
import type { ProductProperty as IProductProperty } from "~/types/index";

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
      properties.filter((p) => p.name !== property.name),
    );
  };

  const selectHandler = (value: string) => {
    const isPropertySelected = selectedProperties.find(
      (p) => p.name === property.name && p.value === value,
    );
    if (isPropertySelected) unselectProperty();
    else selectProperty(value);
  };

  return (
    <div className="mt-4">
      <div>
        {selectedProperty ? (
          <CheckCircleIcon
            className="mr-1 inline h-5 w-5 text-success"
            aria-hidden="true"
          />
        ) : (
          <ExclamationCircleIcon
            className="mr-1 inline h-5 w-5 text-danger"
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
            } ml-2 cursor-pointer border-2 p-1 text-center hover:border-aliexpress focus:outline-none ${ROUNDED}`}
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
