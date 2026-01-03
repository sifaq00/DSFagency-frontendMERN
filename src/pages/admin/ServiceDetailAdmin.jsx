import { useState, useEffect } from "react";
import api from "../../api/axios";
import { FiEdit, FiTrash2, FiPlus, FiX, FiSave, FiLoader } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedToast from "../../components/AnimatedToast";
import LoadingSpinner from "../../components/LoadingSpinner";

// Helper function untuk construct image URL
const getImageUrl = (imagePath) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace('/api', '');
  return `${baseUrl}${imagePath}`;
};

const ServiceDetailAdmin = () => {
  const [serviceDetails, setServiceDetails] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ show: false, success: false, message: "" });

  useEffect(() => {
    fetchServiceDetails();
  }, []);

  const fetchServiceDetails = async () => {
    try {
      setIsFetching(true);
      const response = await api.getServiceDetails();
      setServiceDetails(response.data);
    } catch (error) {
      console.error("Gagal mengambil data service details:", error);
      showToast(false, { title: "Gagal", description: "Gagal mengambil data service details." });
    } finally {
      setIsFetching(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      showToast(false, { title: "Validasi", description: "Judul dan deskripsi harus diisi!" });
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      if (editingId) {
        await api.updateServiceDetail(editingId, formData);
        showToast(true, { title: "Sukses", description: "Service detail berhasil diperbarui!" });
      } else {
        await api.addServiceDetail(formData);
        showToast(true, { title: "Sukses", description: "Service detail berhasil ditambahkan!" });
      }

      resetForm();
      fetchServiceDetails();
    } catch (error) {
      console.error("Gagal menyimpan service detail:", error);
      showToast(false, { title: "Gagal", description: "Gagal menyimpan service detail." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (serviceDetail) => {
    setTitle(serviceDetail.title);
    setDescription(serviceDetail.description);
    setImage(null);
    setPreviewImage(getImageUrl(serviceDetail.image));
    setEditingId(serviceDetail._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus service detail ini?")) return;
    try {
      setIsDeleting(true);
      await api.deleteServiceDetail(id);
      showToast(true, { title: "Sukses", description: "Service detail berhasil dihapus!" });
      fetchServiceDetails();
    } catch (error) {
      console.error("Gagal menghapus service detail:", error);
      showToast(false, { title: "Gagal", description: "Gagal menghapus service detail." });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
    setPreviewImage(null);
    setEditingId(null);
    setIsModalOpen(false);
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
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Kelola Service Detail</h2>

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
      ) : (
        <>
          {/* Tombol Tambah Service Detail */}
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 mb-8 flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus className="text-lg" /> Tambah Service Detail
          </motion.button>

      {/* Modal untuk Form Tambah/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                {editingId ? "Edit Service Detail" : "Tambah Service Detail"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Judul Layanan:</label>
                  <input
                    type="text"
                    placeholder="Judul Layanan"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 dark:bg-gray-700 dark:text-gray-300"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Deskripsi Detail:</label>
                  <textarea
                    placeholder="Deskripsi Detail"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 dark:bg-gray-700 dark:text-gray-300"
                    rows="6"
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Gambar:</label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  />
                </div>

                {(previewImage || (editingId && serviceDetails.find((sd) => sd._id === editingId)?.image)) && (
                  <div className="mb-4">
                    <img
                      src={previewImage || getImageUrl(serviceDetails.find((sd) => sd._id === editingId).image)}
                      alt="Preview Gambar"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <motion.button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                  >
                    {isSubmitting ? <FiLoader className="text-lg animate-spin" /> : <FiSave className="text-lg" />}
                    {isSubmitting ? "Menyimpan..." : editingId ? "Update" : "Tambah"}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                  >
                    <FiX className="text-lg" /> Batal
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daftar Service Details */}
      <ul className="space-y-4">
        <AnimatePresence mode="popLayout">
          {serviceDetails.map((serviceDetail, index) => (
            <motion.li
              key={serviceDetail._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-4">
                {serviceDetail.image && (
                  <img
                    src={getImageUrl(serviceDetail.image)}
                    alt="Service Detail"
                    className="w-20 h-20 object-cover rounded-full"
                  />
                )}
                <div>
                  <strong className="text-gray-800 dark:text-gray-300">{serviceDetail.title}</strong>
                  <p className="text-gray-600 dark:text-gray-400">{serviceDetail.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleEdit(serviceDetail)}
                  className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiEdit className="text-lg" />
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(serviceDetail._id)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDeleting}
                  whileHover={!isDeleting ? { scale: 1.1 } : {}}
                  whileTap={!isDeleting ? { scale: 0.9 } : {}}
                >
                  <FiTrash2 className="text-lg" />
                </motion.button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
        </>
      )}
    </motion.div>
  );
};

export default ServiceDetailAdmin;