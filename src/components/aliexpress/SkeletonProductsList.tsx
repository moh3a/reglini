import { SkeletonProductCard } from "@components/aliexpress";

export const SkeletonProductsList = () => {
  return (
    <div className="my-8 mx-2">
      <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {new Array(20).fill(0).map((_, i) => (
          <SkeletonProductCard key={i} />
        ))}
      </div>
    </div>
  );
};
