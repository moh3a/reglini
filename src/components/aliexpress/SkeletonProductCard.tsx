import { motion } from "framer-motion";

const SkeletonProductCard = () => {
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
      <div className="w-full h-5 bg-gray-500 animate-pulse"></div>
    </motion.div>
  );
};

export default SkeletonProductCard;
