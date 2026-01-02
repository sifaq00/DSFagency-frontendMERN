import { useState, useEffect } from "react";
import api from "../../api/axios";
import { FiEdit, FiSave, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import ToastNotification from "../../components/ToastNotification";

const AboutUsAdmin = () => {
  const [content, setContent] = useState("");
  const [advantages, setAdvantages] = useState([]);
  const [tempContent, setTempContent] = useState("");
  const [tempAdvantages, setTempAdvantages] = useState([]);
  const [newAdvantage, setNewAdvantage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, success: false, message: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.getAboutUs();
      setContent(res.data.content || "");
      setAdvantages(res.data.advantages || []);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setContent("");
      setAdvantages([]);
    }
  };

  const handleEdit = () => {
    setTempContent(content);
    setTempAdvantages([...advantages]);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempContent(content);
    setTempAdvantages([...advantages]);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast(false, "Token tidak ditemukan. Silakan login ulang.");
        return;
      }

      await api.updateAboutUs({ content: tempContent, advantages: tempAdvantages }, token);

      setContent(tempContent);
      setAdvantages(tempAdvantages);
      setIsEditing(false);
      showToast(true, "Berhasil menyimpan data!");
    } catch (err) {
      showToast(false, err.response?.data?.message || "Gagal menyimpan data.");
    }
  };

  const showToast = (success, message) => {
    setToast({
      show: true,
      success,
      message: {
        title: success ? "Sukses" : "Gagal",
        description: message,
      },
    });
    setTimeout(() => setToast({ show: false }), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Kelola About Us</h2>

      {/* Notifikasi Toast */}
      {toast.show && (
        <ToastNotification
          message={toast.message}
          success={toast.success}
          onClose={() => setToast({ show: false })}
        />
      )}

      {!isEditing ? (
        <div>
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{content}</p>
          </div>

          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Keunggulan:</h3>
          <ul className="space-y-3">
            {advantages.map((item, index) => (
              <li
                key={index}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between"
              >
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleEdit}
            className="mt-6 flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            <FiEdit className="text-lg" /> Edit
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 dark:bg-gray-700 dark:text-gray-300"
              rows="6"
              value={tempContent}
              onChange={(e) => setTempContent(e.target.value)}
              placeholder="Masukkan konten About Us..."
            />
          </div>

          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Keunggulan:</h3>
          <ul className="space-y-3 mb-6">
            {tempAdvantages.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
              >
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const updatedAdvantages = [...tempAdvantages];
                    updatedAdvantages[index] = e.target.value;
                    setTempAdvantages(updatedAdvantages);
                  }}
                  className="w-full bg-transparent focus:outline-none dark:text-gray-300"
                />
                <button
                  onClick={() => setTempAdvantages(tempAdvantages.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-600 transition duration-300"
                >
                  <FiTrash2 className="text-lg" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex gap-3 mb-6">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 dark:bg-gray-700 dark:text-gray-300"
              value={newAdvantage}
              onChange={(e) => setNewAdvantage(e.target.value)}
              placeholder="Tambah keunggulan baru..."
            />
            <button
              onClick={() => {
                if (newAdvantage.trim() !== "") {
                  setTempAdvantages([...tempAdvantages, newAdvantage]);
                  setNewAdvantage("");
                }
              }}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center gap-2"
            >
              <FiPlus className="text-lg" /> Tambah
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
            >
              <FiSave className="text-lg" /> Simpan
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition duration-300"
            >
              <FiX className="text-lg" /> Batal
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AboutUsAdmin;