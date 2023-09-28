import { motion } from "framer-motion";

export const SkeletonProductCard = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="group"
    >
      <div className="w-full aspect-w-1 aspect-h-1 bg-gray-500 rounded-lg overflow-hidden">
        <div className="flex justify-center items-center overflow-hidden bg-gray-500 cursor-pointer">
          <div className="object-center object-cover hover:opacity-75 rounded-lg shadow-lg" />
        </div>
      </div>
      <div className="w-full h-5 mt-1 bg-gray-500 rounded-lg animate-pulse"></div>
    </motion.div>
  );
};

export const SkeletonProductsColumn = () => {
  return (
    <div className="my-8 mx-2">
      <div className="grid grid-cols-3 gap-y-8 sm:grid-cols-3 gap-x-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-7">
        {new Array(5).fill(0).map((_, i) => (
          <SkeletonProductCard key={i} />
        ))}
      </div>
    </div>
  );
};

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
