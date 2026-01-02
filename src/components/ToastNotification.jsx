import { useEffect } from "react";
import { FiCheckCircle, FiX, FiAlertCircle } from "react-icons/fi"; // Tambahkan FiAlertCircle untuk error
import PropTypes from "prop-types";

const ToastNotification = ({ message, onClose, type = "success" }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // ⏳ Notifikasi otomatis hilang dalam 3 detik

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 flex items-center gap-3 px-4 py-3 rounded-lg shadow-md ${
        type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {type === "success" ? (
        <FiCheckCircle className="text-green-500" size={20} />
      ) : (
        <FiAlertCircle className="text-red-500" size={20} />
      )}
      <div>
        <p className="font-semibold">{message.title}</p>
        <p className="text-sm">{message.description}</p>
      </div>
      <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
        <FiX size={18} />
      </button>
    </div>
  );
};

// ✅ Validasi props
ToastNotification.propTypes = {
  message: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["success", "error"]),
};

export default ToastNotification;