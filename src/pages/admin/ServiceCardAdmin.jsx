import { useState, useEffect } from "react";
import api from "../../api/axios";
import { FiEdit, FiTrash2, FiPlus, FiX, FiSave } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ToastNotification from "../../components/ToastNotification";

const ServiceCardAdmin = () => {
  const [serviceCards, setServiceCards] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, success: false, message: "" });

  useEffect(() => {
    fetchServiceCards();
  }, []);

  const fetchServiceCards = async () => {
    try {
      const response = await api.getServiceCards();
      setServiceCards(response.data);
    } catch (error) {
      console.error("Gagal mengambil data service cards:", error);
      showToast(false, "Gagal mengambil data service cards.");
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
      showToast(false, "Judul dan deskripsi harus diisi!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      if (editingId) {
        await api.updateServiceCard(editingId, formData);
        showToast(true, "Service card berhasil diperbarui!");
      } else {
        await api.addServiceCard(formData);
        showToast(true, "Service card berhasil ditambahkan!");
      }

      resetForm();
      fetchServiceCards();
    } catch (error) {
      console.error("Gagal menyimpan service card:", error);
      showToast(false, "Gagal menyimpan service card.");
    }
  };

  const handleEdit = (serviceCard) => {
    setTitle(serviceCard.title);
    setDescription(serviceCard.description);
    setImage(null);
    setPreviewImage(`http://localhost:5000${serviceCard.image}`);
    setEditingId(serviceCard._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus service card ini?")) return;
    try {
      await api.deleteServiceCard(id);
      showToast(true, "Service card berhasil dihapus!");
      fetchServiceCards();
    } catch (error) {
      console.error("Gagal menghapus service card:", error);
      showToast(false, "Gagal menghapus service card.");
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
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Kelola Service Card</h2>

      {/* Notifikasi Toast */}
      {toast.show && (
        <ToastNotification
          message={toast.message}
          type={toast.success ? "success" : "error"}
          onClose={() => setToast({ show: false })}
        />
      )}

      {/* Tombol Tambah Service Card */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 mb-8 flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        <FiPlus className="text-lg" /> Tambah Service Card
      </button>

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
                {editingId ? "Edit Service Card" : "Tambah Service Card"}
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
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Deskripsi Singkat:</label>
                  <textarea
                    placeholder="Deskripsi Singkat"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 dark:bg-gray-700 dark:text-gray-300"
                    rows="4"
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

                {(previewImage || (editingId && serviceCards.find((sc) => sc._id === editingId)?.image)) && (
                  <div className="mb-4">
                    <img
                      src={previewImage || `http://localhost:5000${serviceCards.find((sc) => sc._id === editingId).image}`}
                      alt="Preview Gambar"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
                  >
                    <FiSave className="text-lg" /> {editingId ? "Update" : "Tambah"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition duration-300"
                  >
                    <FiX className="text-lg" /> Batal
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daftar Service Cards */}
      <ul className="space-y-4">
        {serviceCards.map((serviceCard) => (
          <li
            key={serviceCard._id}
            className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-4">
              {serviceCard.image && (
                <img
                  src={`http://localhost:5000${serviceCard.image}`}
                  alt="Service Card"
                  className="w-20 h-20 object-cover rounded-full"
                />
              )}
              <div>
                <strong className="text-gray-800 dark:text-gray-300">{serviceCard.title}</strong>
                <p className="text-gray-600 dark:text-gray-400">{serviceCard.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(serviceCard)}
                className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
              >
                <FiEdit className="text-lg" />
              </button>
              <button
                onClick={() => handleDelete(serviceCard._id)}
                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                <FiTrash2 className="text-lg" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ServiceCardAdmin;