import { motion } from "framer-motion";

const SkeletonLoader = ({ count = 3, type = "card" }) => {
  const cardVariants = {
    initial: { opacity: 0.6 },
    animate: { opacity: 1 },
  };

  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-gray-200 dark:bg-gray-700 rounded-lg p-6 h-64"
            variants={cardVariants}
            animate="animate"
            initial="initial"
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"
            variants={cardVariants}
            animate="animate"
            initial="initial"
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
