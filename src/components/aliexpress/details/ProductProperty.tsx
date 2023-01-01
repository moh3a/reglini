/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { ROUNDED } from "@config/design";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ZAE_ProductProperties } from "@reglini-types/zapiex";

interface ProductPropertyProps {
  property: ZAE_ProductProperties;
  setShowImage: Dispatch<SetStateAction<string>>;
  setProperties: Dispatch<
    SetStateAction<
      {
        name: string;
        value: string;
      }[]
    >
  >;
}

const ProductProperty = ({
  property,
  setShowImage,
  setProperties,
}: ProductPropertyProps) => {
  const [selectedProperty, setSelectedProperty] = useState({
    selected: false,
    name: property.name,
    value: "",
  });

  useEffect(() => {
    if (setProperties) {
      setProperties((properties: any) => [
        ...properties,
        { name: selectedProperty.name, value: selectedProperty.value },
      ]);
    }
  }, [setProperties, selectedProperty]);

  const selectHandler = (value: any) => {
    if (selectedProperty.value === value) {
      setSelectedProperty({
        selected: false,
        name: property.name,
        value: "",
      });
    } else {
      setSelectedProperty({
        selected: true,
        name: property.name,
        value: value,
      });
    }
  };

  return (
    <div key={property.name} className="mt-4">
      <div>
        {selectedProperty.value ? (
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
        {property.name} : {selectedProperty.value}
      </div>

      <div className={`flex flex-wrap`}>
        {property.values.map((value) => {
          return (
            <div
              onClick={() => selectHandler(value.name)}
              key={value.id}
              className={`${
                selectedProperty.value === value.name
                  ? "border-aliexpress"
                  : "border-gray-300"
              } ml-2 p-1 border-2 text-center hover:border-aliexpress focus:outline-none cursor-pointer ${ROUNDED}`}
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
          );
        })}
      </div>
    </div>
  );
};

export default ProductProperty;
