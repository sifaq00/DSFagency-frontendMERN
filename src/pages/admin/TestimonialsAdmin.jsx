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

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ show: false, success: false, message: "" });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setIsFetching(true);
      const response = await api.getTestimonials();
      setTestimonials(response.data);
    } catch (error) {
      console.error("Gagal mengambil data testimonial:", error);
      showToast(false, { title: "Gagal", description: "Gagal mengambil data testimonial." });
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

    if (!author.trim() || !content.trim()) {
      showToast(false, { title: "Validasi", description: "Nama dan pesan harus diisi!" });
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("author", author);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      if (editingId) {
        await api.updateTestimonial(editingId, formData);
        showToast(true, { title: "Sukses", description: "Testimonial berhasil diperbarui!" });
      } else {
        await api.addTestimonial(formData);
        showToast(true, { title: "Sukses", description: "Testimonial berhasil ditambahkan!" });
      }

      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error("Gagal menyimpan testimonial:", error);
      showToast(false, { title: "Gagal", description: "Gagal menyimpan testimonial." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (testimonial) => {
    setAuthor(testimonial.author);
    setContent(testimonial.content);
    setImage(null);
    setPreviewImage(getImageUrl(testimonial.image));
    setEditingId(testimonial._id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (testimonial) => {
    setTestimonialToDelete(testimonial);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!testimonialToDelete) return;
    try {
      setIsDeleting(true);
      await api.deleteTestimonial(testimonialToDelete._id);
      showToast(true, { title: "Sukses", description: "Testimonial berhasil dihapus!" });
      fetchTestimonials();
    } catch (error) {
      console.error("Gagal menghapus testimonial:", error);
      showToast(false, { title: "Gagal", description: "Gagal menghapus testimonial." });
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setTestimonialToDelete(null);
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setAuthor("");
    setContent("");
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
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Kelola Testimonials</h2>

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
          {/* Tombol Tambah Testimonial */}
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 mb-8 flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus className="text-lg" /> Tambah Testimonial
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
                {editingId ? "Edit Testimonial" : "Tambah Testimonial"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Nama Pengguna:</label>
                  <input
                    type="text"
                    placeholder="Nama Pengguna"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 dark:bg-gray-700 dark:text-gray-300"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Pesan Testimonial:</label>
                  <textarea
                    placeholder="Pesan Testimonial"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
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

                {(previewImage || (editingId && testimonials.find((t) => t._id === editingId)?.image)) && (
                  <div className="mb-4">
                    <img
                      src={previewImage || getImageUrl(testimonials.find((t) => t._id === editingId).image)}
                      alt="Preview Gambar"
                      className="w-24 h-auto object-cover"
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
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Hapus Testimonial</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Apakah Anda yakin ingin menghapus testimonial dari <strong>{testimonialToDelete?.author}</strong>?
              </p>
              <div className="flex gap-3">
                <motion.button
                  onClick={handleDeleteConfirm}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDeleting}
                  whileHover={!isDeleting ? { scale: 1.05 } : {}}
                  whileTap={!isDeleting ? { scale: 0.95 } : {}}
                >
                  {isDeleting ? <FiLoader className="text-lg animate-spin" /> : <FiTrash2 className="text-lg" />}
                  {isDeleting ? "Menghapus..." : "Hapus"}
                </motion.button>
                <motion.button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDeleting}
                  whileHover={!isDeleting ? { scale: 1.05 } : {}}
                  whileTap={!isDeleting ? { scale: 0.95 } : {}}
                >
                  <FiX className="text-lg" /> Batal
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daftar Testimonials */}
      <ul className="space-y-4">
        <AnimatePresence mode="popLayout">
          {testimonials.map((testimonial, index) => (
            <motion.li
              key={testimonial._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-4">
                {testimonial.image && (
                  <img
                    src={getImageUrl(testimonial.image)}
                    alt="Testimonial"
                    className="w-20 h-20 object-cover rounded-full"
                  />
                )}
                <div>
                  <strong className="text-gray-800 dark:text-gray-300">{testimonial.author}</strong>
                  <p className="text-gray-600 dark:text-gray-400">{testimonial.content}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleEdit(testimonial)}
                  className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiEdit className="text-lg" />
                </motion.button>
                <motion.button
                  onClick={() => handleDeleteClick(testimonial)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
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

export default TestimonialsAdmin;