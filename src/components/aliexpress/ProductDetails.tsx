import { useRouter } from "next/router";
import { trpc } from "@utils/trpc";

const ProductDetails = ({ id }: { id: string }) => {
  const router = useRouter();
  const product = trpc.aliexpress.product.useQuery({
    id,
    locale: router.locale?.toUpperCase(),
  });

  return (
    <div>
      <div>{id}</div>
      <div>{JSON.stringify(product.data)}</div>
    </div>
  );
};

export default ProductDetails;
