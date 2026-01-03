import { motion } from "framer-motion";

const LoadingSpinner = ({ size = "md", fullscreen = false }) => {
  const sizeMap = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const containerClass = fullscreen
    ? "fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
    : "flex items-center justify-center";

  return (
    <div className={containerClass}>
      <motion.div
        className={`${sizeMap[size]} border-4 border-gray-300 dark:border-gray-600 border-t-orange-500 dark:border-t-orange-400 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default LoadingSpinner;
