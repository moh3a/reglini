import type { RAE_Product } from "~/types/ae/rae";
import { useTranslations } from "next-intl";

export const ProductReviews = ({ product }: { product: RAE_Product }) => {
  const t = useTranslations("AliexpressPage.reviews");
  return (
    <div className={`mb-4 flex`}>
      <span className={`flex items-center`}>
        {product.hasReviewsRatings && (
          <>
            <span className={`mr-4`}>
              <svg
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="inline h-4 w-4 text-aliexpress"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              <span className="ml-1">
                {product.reviewsRatings.averageRating}
              </span>
            </span>
            <span className={`mx-4`}>
              <span>{product.reviewsRatings.totalCount}</span>{" "}
              <span className="mr-1">{t("title")}</span>
            </span>
          </>
        )}
        {product.totalOrders > 0 && (
          <span className={`ml-4`}>
            <span>{product.totalOrders}</span>{" "}
            <span className="mr-1">{t("orders")}</span>
          </span>
        )}
      </span>
    </div>
  );
};
