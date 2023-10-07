import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Modal, Pagination } from "~/components/shared";
import { ProductCard, SkeletonProductsList } from "~/components/aliexpress";
import type { IMessage } from "~/types/index";
import { api } from "~/utils/api";
import { API_RESPONSE_MESSAGES } from "~/config/constants";
import { DEFAULT_PAGE_SIZE } from "~/config/constants";

export const ProductsList = () => {
  const router = useRouter();
  const { q, p } = router.query;

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<IMessage>();
  useEffect(() => {
    if (message?.type) setIsOpen(true);
    else setIsOpen(false);
  }, [message?.type]);

  const searchProducts = api.aliexpress.affiliate.search.useQuery(
    {
      search: q?.toString(),
      locale: router.locale,
      page_no: p ? parseInt(p.toString()) : undefined,
      page_size: DEFAULT_PAGE_SIZE,
    },
    {
      onSettled(data, error) {
        if (error)
          setMessage({
            type: "error",
            text: API_RESPONSE_MESSAGES.ERROR_OCCURED,
          });
        if (data && !data.success)
          setMessage({ type: "error", text: data.error });
      },
    },
  );

  return (
    <div className="mx-2 my-8">
      <Modal
        type={message?.type}
        title={message?.type?.toUpperCase()}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        {message?.text}
      </Modal>

      {/* {!q && !p && <SkeletonProductsColumn />} */}

      {searchProducts.isLoading && <SkeletonProductsList />}
      {searchProducts.isFetched &&
      searchProducts?.data?.data?.items &&
      searchProducts.data.data.items.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {searchProducts.data.data.items.map((product) => (
              <ProductCard
                product={product}
                setMessage={setMessage}
                key={product.productId}
              />
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
