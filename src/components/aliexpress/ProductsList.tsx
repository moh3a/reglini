import { useRouter } from "next/router";

import { Pagination } from "~/components/shared";
import { ProductCard, SkeletonProductsList } from "~/components/aliexpress";
import { api } from "~/utils/api";
import { API_RESPONSE_MESSAGES } from "~/config/constants";
import { DEFAULT_PAGE_SIZE } from "~/config/constants";
import { useMessage } from "~/utils/store";
import { ONE_DAY_IN_SECONDS } from "~/utils";

export const ProductsList = () => {
  const router = useRouter();
  const { q, p } = router.query;

  const { setMessage } = useMessage();

  const searchProducts = api.aliexpress.affiliate.search.useQuery(
    {
      search: q?.toString(),
      locale: router.locale,
      page_no: p ? parseInt(p.toString()) : undefined,
      page_size: DEFAULT_PAGE_SIZE,
    },
    {
      cacheTime: ONE_DAY_IN_SECONDS,
      keepPreviousData: true,
      onSettled(data, error) {
        if (error)
          setMessage({
            type: "error",
            text: API_RESPONSE_MESSAGES.ERROR_OCCURED,
          });
        if (data && !data.success)
          setMessage({ type: "error", text: data.error ?? "" });
      },
    },
  );

  return (
    <div className="mx-2 my-8">
      {searchProducts.isLoading && <SkeletonProductsList />}
      {searchProducts.isFetched &&
      searchProducts?.data?.data?.items &&
      searchProducts.data.data.items.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {searchProducts.data.data.items.map((product) => (
              <ProductCard product={product} key={product.productId} />
            ))}
          </div>

          <Pagination
            current={p ? parseInt(p.toString()) : 1}
            unitsPerPage={searchProducts.data.data.resultsPerPage}
            totalUnits={searchProducts.data.data.totalCount}
          />
        </>
      ) : (
        <div className="flex items-center justify-center font-mono text-xl">
          No results!
        </div>
      )}
    </div>
  );
};
