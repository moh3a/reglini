import { DS_ProductAPI_Product_Details } from "@reglini-types/ae";
import { useTranslations } from "next-intl";

const ProductReviews = ({
  product,
}: {
  product: DS_ProductAPI_Product_Details;
}) => {
  const t = useTranslations("AliexpressPage.reviews");
  return (
    <div className={`flex mb-4`}>
      <span className={`flex items-center`}>
        {product.avg_evaluation_rating && (
          <>
            <span className={`mr-4`}>
              <svg
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 text-aliexpress inline"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              <span className="ml-1">{product.avg_evaluation_rating}</span>
            </span>
            <span className={`mx-4`}>
              <span>{product.evaluation_count}</span>{" "}
              <span className="mr-1">{t("title")}</span>
            </span>
          </>
        )}
        <span className={`ml-4`}>
          <span>{product.order_count}</span>{" "}
          <span className="mr-1">{t("orders")}</span>
        </span>
      </span>
    </div>
  );
};
export default ProductReviews;
