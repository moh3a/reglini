import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Modal, Pagination } from "~/components/shared";
import {
  ProductCard,
  SkeletonProductsColumn,
  SkeletonProductsList,
} from "~/components/aliexpress";
import type { IMessage } from "~/types/index";
import { trpc } from "~/utils/trpc";
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

  const searchProducts = trpc.aliexpress.affiliate.search.useQuery(
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
    }
  );

  return (
    <div className="my-8 mx-2">
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
      searchProducts.data &&
      searchProducts.data.data &&
      searchProducts.data.data.items &&
      searchProducts.data.data.items.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {searchProducts.data.data.items.map((product) => (
              <ProductCard
                product={product}
                setMessage={setMessage}
                key={product.productId}
              />
            ))}
          </div>
          {p && (
            <Pagination
              current={parseInt(p.toString())}
              unitsPerPage={searchProducts.data.data.resultsPerPage}
              totalUnits={searchProducts.data.data.totalCount}
            />
          )}
        </>
      ) : (
        <div className="flex justify-center items-center text-xl font-mono">
          No results!
        </div>
      )}
    </div>
  );
};
