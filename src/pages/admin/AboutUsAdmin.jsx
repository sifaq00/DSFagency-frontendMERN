import { useState, useEffect } from "react";
import api from "../../api/axios";
import { FiEdit, FiSave, FiTrash2, FiPlus, FiX, FiLoader, FiImage, FiUpload } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedToast from "../../components/AnimatedToast";
import LoadingSpinner from "../../components/LoadingSpinner";

const AboutUsAdmin = () => {
  const [content, setContent] = useState("");
  const [advantages, setAdvantages] = useState([]);
  const [aboutImage, setAboutImage] = useState("");
  const [tempContent, setTempContent] = useState("");
  const [tempAdvantages, setTempAdvantages] = useState([]);
  const [tempImage, setTempImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [newAdvantage, setNewAdvantage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, success: false, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsFetching(true);
      const res = await api.getAboutUs();
      setContent(res.data.content || "");
      setAdvantages(res.data.advantages || []);
      setAboutImage(res.data.aboutImage || "");
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      showToast(false, { title: "Gagal", description: "Gagal mengambil data." });
      setContent("");
      setAdvantages([]);
      setAboutImage("");
    } finally {
      setIsFetching(false);
    }
  };

  const handleEdit = () => {
    setTempContent(content);
    setTempAdvantages([...advantages]);
    setTempImage(aboutImage);
    setImagePreview(aboutImage);
    setImageFile(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempContent(content);
    setTempAdvantages([...advantages]);
    setTempImage(aboutImage);
    setImagePreview("");
    setImageFile(null);
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setTempImage("");
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showToast(false, { title: "Gagal", description: "Token tidak ditemukan. Silakan login ulang." });
        return;
      }

      const formData = new FormData();
      formData.append("content", tempContent);
      formData.append("advantages", JSON.stringify(tempAdvantages));
      
      if (imageFile) {
        formData.append("aboutImage", imageFile);
      } else {
        formData.append("aboutImage", tempImage);
      }

      const res = await api.updateAboutUs(formData, token);

      setContent(tempContent);
      setAdvantages(tempAdvantages);
      setAboutImage(res.data.about?.aboutImage || tempImage);
      setIsEditing(false);
      setImageFile(null);
      setImagePreview("");
      showToast(true, { title: "Sukses", description: "Berhasil menyimpan data!" });
    } catch (err) {
      showToast(false, { title: "Gagal", description: err.response?.data?.message || "Gagal menyimpan data." });
    } finally {
      setIsSubmitting(false);
    }
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
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Kelola About Us</h2>

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
          {/* Display Image */}
          {aboutImage && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Gambar About Us:</h3>
              <img 
                src={aboutImage} 
                alt="About Us" 
                className="w-64 h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

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
            disabled={isSubmitting}
            className="mt-6 flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-300 font-semibold"
          >
            <FiEdit className="text-lg" /> Edit
          </button>
        </div>
      ) : (
        <div>
          {/* Image Upload Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Gambar About Us:</h3>
            
            {(imagePreview || tempImage) ? (
              <div className="relative inline-block">
                <img 
                  src={imagePreview || tempImage} 
                  alt="Preview" 
                  className="w-64 h-64 object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition shadow-lg"
                >
                  <FiX className="text-lg" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-700">
                <FiImage className="text-4xl text-gray-400 mb-2" />
                <span className="text-gray-500 dark:text-gray-400 text-sm">Klik untuk upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}

            {(imagePreview || tempImage) && (
              <label className="mt-3 flex items-center gap-2 text-blue-500 hover:text-blue-600 cursor-pointer w-fit">
                <FiUpload />
                <span className="text-sm">Ganti gambar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

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
            <motion.button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed transition duration-300 font-semibold"
            >
              {isSubmitting ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <FiLoader className="text-lg" />
                </motion.div>
              ) : (
                <FiSave className="text-lg" />
              )}
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </motion.button>
            <motion.button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-300 font-semibold"
            >
              <FiX className="text-lg" /> Batal
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AboutUsAdmin;