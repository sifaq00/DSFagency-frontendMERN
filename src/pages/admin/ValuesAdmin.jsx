import { useState, useEffect } from "react";
import api from "../../api/axios";
import { FiEdit, FiSave, FiX, FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";
import AnimatedToast from "../../components/AnimatedToast";
import LoadingSpinner from "../../components/LoadingSpinner";

const ValuesAdmin = () => {
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, success: false, message: "" });

  useEffect(() => {
    const fetchValues = async () => {
      try {
        setIsFetching(true);
        const response = await api.getValues();
        setVision(response.data.vision);
        setMission(response.data.mission);
      } catch (error) {
        console.error("Gagal mengambil data Values:", error);
        showToast(false, { title: "Gagal", description: "Gagal mengambil data Values." });
      } finally {
        setIsFetching(false);
      }
    };
    fetchValues();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.updateValues({ vision, mission });
      showToast(true, { title: "Sukses", description: "Data berhasil diperbarui!" });
      console.log("Update berhasil:", response.data);
      setIsEditing(false);
    } catch (error) {
      showToast(false, { title: "Gagal", description: "Gagal memperbarui data." });
      console.error("Error saat update Values:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const showToast = (success, message) => {
    setToast({
      show: true,
      success,
      message,
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
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Kelola Values</h2>

      {/* Notifikasi Toast */}
      {toast.show && (
        <AnimatedToast
          message={toast.message}
          type={toast.success ? "success" : "error"}
          onClose={() => setToast({ show: false })}
        />
      )}

      {isFetching ? (
        <LoadingSpinner size="lg" />
      ) : !isEditing ? (
        <div>
          {/* Tampilkan Our Vision */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Our Vision:</label>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{vision}</p>
          </div>

          {/* Tampilkan Our Mission */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Our Mission:</label>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{mission}</p>
          </div>

          {/* Tombol Edit */}
          <motion.button
            onClick={handleEdit}
            className="mt-4 flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiEdit className="text-lg" /> Edit
          </motion.button>
        </div>
      ) : (
        /* Tampilkan form edit jika dalam mode edit */
        <div>
          {/* Input untuk Our Vision */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Our Vision:</label>
            <textarea
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 dark:bg-gray-700 dark:text-gray-300"
              rows="3"
              placeholder="Masukkan visi perusahaan..."
            ></textarea>
          </div>

          {/* Input untuk Our Mission */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Our Mission:</label>
            <textarea
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 dark:bg-gray-700 dark:text-gray-300"
              rows="4"
              placeholder="Masukkan misi perusahaan..."
            ></textarea>
          </div>

          {/* Tombol Simpan dan Batal */}
          <div className="flex gap-3">
            <motion.button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
            >
              {loading ? <FiLoader className="text-lg animate-spin" /> : <FiSave className="text-lg" />}
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </motion.button>
            <motion.button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
            >
              <FiX className="text-lg" /> Batal
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ValuesAdmin;