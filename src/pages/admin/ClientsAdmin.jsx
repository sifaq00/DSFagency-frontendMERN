import { useState, useEffect } from "react";
import api from "../../api/axios";
import { FiEdit, FiTrash2, FiPlus, FiX, FiSave } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ToastNotification from "../../components/ToastNotification";

// Helper function untuk construct image URL
const getImageUrl = (imagePath) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace('/api', '');
  return `${baseUrl}${imagePath}`;
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

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.getClients();
      setClients(response.data);
    } catch (error) {
      console.error("Gagal mengambil data clients:", error);
      showToast(false, "Gagal mengambil data clients.");
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
      showToast(false, "Nama client harus diisi!");
      return;
    }

    if (!editingId && !logo) {
      showToast(false, "Logo harus diupload!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (logo) {
        formData.append("logo", logo);
      }

      if (editingId) {
        await api.updateClient(editingId, formData);
        showToast(true, "Client berhasil diperbarui!");
      } else {
        await api.addClient(formData);
        showToast(true, "Client berhasil ditambahkan!");
      }

      resetForm();
      fetchClients();
    } catch (error) {
      console.error("Gagal menyimpan client:", error);
      showToast(false, "Gagal menyimpan client.");
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
      await api.deleteClient(clientToDelete._id);
      showToast(true, "Client berhasil dihapus!");
      fetchClients();
    } catch (error) {
      console.error("Gagal menghapus client:", error);
      showToast(false, "Gagal menghapus client.");
    } finally {
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
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Kelola Clients</h2>

      {/* Notifikasi Toast */}
      {toast.show && (
        <ToastNotification
          message={toast.message}
          type={toast.success ? "success" : "error"}
          onClose={() => setToast({ show: false })}
        />
      )}

      {/* Tombol Tambah Client */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 mb-8 flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        <FiPlus className="text-lg" /> Tambah Client
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
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  <FiTrash2 className="text-lg" /> Hapus
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition duration-300"
                >
                  <FiX className="text-lg" /> Batal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daftar Clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <div
            key={client._id}
            className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300"
          >
            <div className="flex flex-col items-center">
              {client.logo && (
                <div className="w-32 h-32 border border-gray-300 rounded-lg flex items-center justify-center bg-white p-4 mb-4">
                  <img
                    src={getImageUrl(client.logo)}
                    alt={client.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
              <strong className="text-gray-800 dark:text-gray-300 text-center mb-4">{client.name}</strong>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(client)}
                  className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
                >
                  <FiEdit className="text-lg" />
                </button>
                <button
                  onClick={() => handleDeleteClick(client)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  <FiTrash2 className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">Belum ada client. Tambahkan client pertama Anda!</p>
        </div>
      )}
    </motion.div>
  );
};

export default ClientsAdmin;
