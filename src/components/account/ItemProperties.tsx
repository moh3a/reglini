import type { Prisma, Cart, Product } from "@prisma/client";
import type { RAE_ProductVariationProperties } from "~/types/ae/rae";

import { isArray } from "lodash";

const ItemProperties = ({
  product,
}: {
  product: Omit<Product, "orderId"> | Cart;
}) => (
  <div className="my-2 flex flex-wrap items-end justify-between text-xs">
    {product.properties &&
      isArray(product.properties as Prisma.JsonValue) &&
      (product.properties as unknown as RAE_ProductVariationProperties[])?.map(
        (property) => (
          <div key={property.id} className={`hover:underline`}>
            {property.name}:
            <span className="font-bold text-gray-500">
              {property.value.name}
            </span>
          </div>
        ),
      )}
  </div>
);

export default ItemProperties;
