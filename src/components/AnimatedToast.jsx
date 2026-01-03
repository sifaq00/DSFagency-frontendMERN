import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";

const AnimatedToast = ({ message, type = "success", onClose }) => {
  const isSuccess = type === "success";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
        className={`fixed top-6 right-6 z-50 max-w-md rounded-lg shadow-xl backdrop-blur-sm border p-4 flex items-start gap-3 ${
          isSuccess
            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700"
            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
        }`}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 200 }}
        >
          {isSuccess ? (
            <FiCheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <FiAlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <p
            className={`font-semibold ${
              isSuccess
                ? "text-emerald-900 dark:text-emerald-100"
                : "text-red-900 dark:text-red-100"
            }`}
          >
            {message.title}
          </p>
          <p
            className={`text-sm mt-1 ${
              isSuccess
                ? "text-emerald-700 dark:text-emerald-200"
                : "text-red-700 dark:text-red-200"
            }`}
          >
            {message.description}
          </p>
        </div>

        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
            isSuccess
              ? "hover:bg-emerald-100 dark:hover:bg-emerald-800 text-emerald-600 dark:text-emerald-400"
              : "hover:bg-red-100 dark:hover:bg-red-800 text-red-600 dark:text-red-400"
          }`}
        >
          <FiX className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedToast;
