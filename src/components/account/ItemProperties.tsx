const ItemProperties = ({ product }: any) => {
  return (
    <div className="flex flex-wrap items-end justify-between text-xs my-2">
      {(
        product.properties &&
        (product.properties[0].sku_property_id || product.properties[0].id
          ? product.properties
          : JSON.parse(product.properties as string))
      )?.map((property: any) => (
        <div
          key={property.sku_property_id ?? property.id}
          className={`hover:underline`}
        >
          {property.sku_property_id ? (
            <>
              {property.sku_property_name}:
              <span className="font-bold text-gray-500">
                {property.property_value_definition_name ??
                  property.property_value_id_long}
              </span>
            </>
          ) : (
            <>
              {property.name}:
              <span className="font-bold text-gray-500">
                {property.value.name}
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ItemProperties;
