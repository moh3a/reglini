import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Loading from "@components/shared/Loading";
import Modal from "@components/shared/Modal";
import AffiliateProductCard from "@components/aliexpress_v2/ProductCard";
import Pagination from "@components/shared/Pagination";
import ProductCard from "./ProductCard";
import { IMessage } from "@reglini-types/index";
import { trpc } from "@utils/trpc";

const ProductsList = () => {
  const router = useRouter();
  const { q, p } = router.query;

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<IMessage>();
  useEffect(() => {
    if (message?.type) setIsOpen(true);
    else setIsOpen(false);
  }, [message?.type]);

  const searchZapiexProducts = trpc.zapiex.search.useQuery({
    text: q as string,
    locale: router.locale,
    page: parseInt((p as string) ?? "1"),
  });

  const searchAffiliateProducts = trpc.aliexpress.affiliate.search.useQuery({
    locale: router.locale,
  });

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

      {q ? (
        <>
          {searchZapiexProducts.isLoading && (
            <div className="w-full flex justify-center items-center">
              <Loading size="large" />
            </div>
          )}
          {searchZapiexProducts.isFetched &&
            searchZapiexProducts.data &&
            searchZapiexProducts.data.data && (
              <>
                {searchZapiexProducts.data.data.items &&
                searchZapiexProducts.data.data.items.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                      {searchZapiexProducts.data.data.items.map((product) => (
                        <ProductCard
                          product={product}
                          setMessage={setMessage}
                          key={product.productId}
                        />
                      ))}
                    </div>
                    <Pagination
                      current={parseInt(p?.toString() ?? "1")}
                      unitsPerPage={
                        searchZapiexProducts.data.data.resultsPerPage
                      }
                      totalUnits={searchZapiexProducts.data.data.totalCount}
                    />
                  </>
                ) : (
                  <div className="flex justify-center items-center text-xl font-mono">
                    No results!
                  </div>
                )}
              </>
            )}
        </>
      ) : (
        <>
          {searchAffiliateProducts.isLoading && (
            <div className="w-full flex justify-center items-center">
              <Loading size="large" />
            </div>
          )}
          {searchAffiliateProducts.data &&
          searchAffiliateProducts.data.resp_result &&
          searchAffiliateProducts.data.resp_result.result &&
          searchAffiliateProducts.data.resp_result.result.current_record_count >
            0 ? (
            <>
              <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {searchAffiliateProducts.data.resp_result.result.products.map(
                  (product) => (
                    <AffiliateProductCard
                      product={product}
                      setMessage={setMessage}
                      key={product.product_id}
                    />
                  )
                )}
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center text-xl font-mono">
              {searchAffiliateProducts.isFetched && "No results!"}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsList;
