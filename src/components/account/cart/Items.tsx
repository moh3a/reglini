import type { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";

import CartItem from "~/components/account/cart/Item";
import { type CartItems } from "~/components/account/cart/Slideover";
import { Loading } from "~/components/shared";
import { api } from "~/utils/api";

export default function Items({
  setSubtotal,
  setProducts,
  setItemsCount,
}: {
  setSubtotal: Dispatch<SetStateAction<number>>;
  setItemsCount: Dispatch<SetStateAction<number>>;
  setProducts: Dispatch<SetStateAction<CartItems>>;
}) {
  const t = useTranslations("Common.cart");

  const cartQuery = api.cart.get.useQuery(undefined, {
    onSettled(data) {
      if (data?.cart) {
        let subs = 0;
        let count = 0;
        data.cart.forEach((item) => {
          if (item.price) subs += item.price * (item.quantity ?? 1);
          if (item.quantity) count += item.quantity;
        });
        setSubtotal(subs);
        setItemsCount(count);

        setProducts(
          data.cart.map((product) => ({
            productId: product.productId,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            imageUrl: product.imageUrl,
            properties: product.properties,
            quantity: product.quantity,
            sku: product.sku,
            carrierId: product.carrierId,
            shippingPrice: product.shippingPrice,
            totalPrice: product.totalPrice,
          })),
        );
      }
    },
  });

  return (
    <>
      {cartQuery.isLoading && (
        <div className="flex w-full items-center justify-center">
          <Loading size="medium" />
        </div>
      )}
      {cartQuery?.data?.cart && cartQuery.data.cart.length > 0 ? (
        cartQuery.data.cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))
      ) : (
        <li className="flex py-6">{t("empty")}</li>
      )}
    </>
  );
}
