import { useState, useEffect } from "react";
import api from "../../api/axios";
import { FiEdit, FiTrash2, FiPlus, FiX, FiSave, FiLoader } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedToast from "../../components/AnimatedToast";
import LoadingSpinner from "../../components/LoadingSpinner";

// Helper function untuk construct image URL
const getImageUrl = (imagePath) => {
  // Jika sudah URL lengkap dari Cloudinary, return langsung
  if (imagePath?.startsWith('http')) return imagePath;
  
  // Fallback untuk local development atau old data
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const baseUrl = apiUrl.endsWith("/api") ? apiUrl.slice(0, -4) : apiUrl;
  try {
    return new URL(imagePath, baseUrl).href;
  } catch (e) {
    return `${baseUrl}${imagePath}`;
  }
};

const ClientsAdmin = () => {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, success: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsFetching(true);
      const response = await api.getClients();
      setClients(response.data);
    } catch (error) {
      console.error("Gagal mengambil data clients:", error);
      showToast(false, { title: "Gagal", description: "Gagal mengambil data clients." });
    } finally {
      setIsFetching(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast(false, { title: "Validasi", description: "Nama client harus diisi!" });
      return;
    }

    if (!editingId && !logo) {
      showToast(false, { title: "Validasi", description: "Logo harus diupload!" });
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", name);
      if (logo) {
        formData.append("logo", logo);
      }

      if (editingId) {
        await api.updateClient(editingId, formData);
        showToast(true, { title: "Sukses", description: "Client berhasil diperbarui!" });
      } else {
        await api.addClient(formData);
        showToast(true, { title: "Sukses", description: "Client berhasil ditambahkan!" });
      }

      resetForm();
      fetchClients();
    } catch (error) {
      console.error("Gagal menyimpan client:", error);
      showToast(false, { title: "Gagal", description: "Gagal menyimpan client." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (client) => {
    setName(client.name);
    setLogo(null);
    setPreviewLogo(getImageUrl(client.logo));
    setEditingId(client._id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;
    try {
      setIsDeleting(true);
      await api.deleteClient(clientToDelete._id);
      showToast(true, { title: "Sukses", description: "Client berhasil dihapus!" });
      fetchClients();
    } catch (error) {
      console.error("Gagal menghapus client:", error);
      showToast(false, { title: "Gagal", description: "Gagal menghapus client." });
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setClientToDelete(null);
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setLogo(null);
    setPreviewLogo(null);
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
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Kelola Clients</h2>

      {/* Notifikasi Toast */}
      {toast.show && (
        <AnimatedToast
          message={toast.message}
          type={toast.success ? "success" : "error"}
          onClose={() => setToast({ show: false })}
        />
      )}

      {/* Tombol Tambah Client */}
      <motion.button
        onClick={() => setIsModalOpen(true)}
        disabled={isSubmitting || isDeleting}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 mb-8 flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-300"
      >
        <FiPlus className="text-lg" /> Tambah Client
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
                {editingId ? "Edit Client" : "Tambah Client"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Nama Client:</label>
                  <input
                    type="text"
                    placeholder="Nama Client"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 dark:bg-gray-700 dark:text-gray-300"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Logo Client:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  />
                  <p className="text-sm text-gray-500 mt-1">Format: PNG, JPG, atau SVG (Ukuran maksimal: 2MB)</p>
                </div>

                {(previewLogo || (editingId && clients.find((c) => c._id === editingId)?.logo)) && (
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Preview Logo:</label>
                    <div className="w-32 h-32 border border-gray-300 rounded-lg flex items-center justify-center bg-white p-4">
                      <img
                        src={previewLogo || getImageUrl(clients.find((c) => c._id === editingId).logo)}
                        alt="Preview Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <motion.button
                    type="submit"
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
                    {isSubmitting ? "Menyimpan..." : editingId ? "Update" : "Tambah"}
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
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal untuk Konfirmasi Hapus */}
      <AnimatePresence>
        {isDeleteModalOpen && (
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
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Hapus Client</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Apakah Anda yakin ingin menghapus client <strong>{clientToDelete?.name}</strong>?
              </p>
              <div className="flex gap-3">
                <motion.button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  whileHover={!isDeleting ? { scale: 1.02 } : {}}
                  whileTap={!isDeleting ? { scale: 0.98 } : {}}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed transition duration-300 font-semibold"
                >
                  {isDeleting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <FiLoader className="text-lg" />
                    </motion.div>
                  ) : (
                    <FiTrash2 className="text-lg" />
                  )}
                  {isDeleting ? "Menghapus..." : "Hapus"}
                </motion.button>
                <motion.button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  whileHover={!isDeleting ? { scale: 1.02 } : {}}
                  whileTap={!isDeleting ? { scale: 0.98 } : {}}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-300 font-semibold"
                >
                  <FiX className="text-lg" /> Batal
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daftar Clients */}
      {isFetching ? (
        <LoadingSpinner size="lg" />
      ) : clients.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">Belum ada client. Tambahkan client pertama Anda!</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {clients.map((client) => (
              <motion.div
                key={client._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-lg transition duration-300"
              >
                <div className="flex flex-col items-center">
                  {client.logo && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="w-32 h-32 border border-gray-300 rounded-lg flex items-center justify-center bg-white p-4 mb-4"
                    >
                      <img
                        src={getImageUrl(client.logo)}
                        alt={client.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </motion.div>
                  )}
                  <strong className="text-gray-800 dark:text-gray-300 text-center mb-4">{client.name}</strong>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleEdit(client)}
                      disabled={isSubmitting || isDeleting}
                      whileHover={!isSubmitting && !isDeleting ? { scale: 1.1 } : {}}
                      whileTap={!isSubmitting && !isDeleting ? { scale: 0.95 } : {}}
                      className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 disabled:bg-yellow-400 disabled:cursor-not-allowed transition duration-300"
                    >
                      <FiEdit className="text-lg" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteClick(client)}
                      disabled={isSubmitting || isDeleting}
                      whileHover={!isSubmitting && !isDeleting ? { scale: 1.1 } : {}}
                      whileTap={!isSubmitting && !isDeleting ? { scale: 0.95 } : {}}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed transition duration-300"
                    >
                      <FiTrash2 className="text-lg" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

    </motion.div>
  );
};

export default ClientsAdmin;
