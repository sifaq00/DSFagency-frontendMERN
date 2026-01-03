import { useState, useEffect } from "react";
import api from "../../api/axios";
import { FiMail, FiTrash2, FiCheck, FiMessageCircle, FiX, FiLoader, FiEye, FiClock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedToast from "../../components/AnimatedToast";
import LoadingSpinner from "../../components/LoadingSpinner";

const ContactAdmin = () => {
  const [contacts, setContacts] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [toast, setToast] = useState({ show: false, success: false, message: "" });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsFetching(true);
      const response = await api.getContacts();
      setContacts(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pesan:", error);
      showToast(false, { title: "Gagal", description: "Gagal mengambil data pesan." });
    } finally {
      setIsFetching(false);
    }
  };

  const handleViewMessage = async (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
    
    // Mark as read if unread
    if (!contact.isRead) {
      try {
        await api.markContactAsRead(contact._id);
        setContacts(contacts.map(c => 
          c._id === contact._id ? { ...c, isRead: true } : c
        ));
      } catch (error) {
        console.error("Gagal update status:", error);
      }
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      showToast(false, { title: "Validasi", description: "Pesan balasan harus diisi!" });
      return;
    }
    
    try {
      setIsReplying(true);
      const response = await api.replyContact(selectedContact._id, replyMessage);
      const { emailSent, message } = response.data;
      
      if (emailSent) {
        showToast(true, { title: "Sukses", description: "Balasan berhasil dikirim ke email user!" });
      } else {
        showToast(true, { title: "Tersimpan", description: message || "Balasan tersimpan, tapi email gagal terkirim." });
      }
      
      setIsReplyModalOpen(false);
      setReplyMessage("");
      fetchContacts();
    } catch (error) {
      showToast(false, { title: "Gagal", description: "Gagal menyimpan balasan." });
    } finally {
      setIsReplying(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pesan ini?")) return;
    
    try {
      setIsDeleting(true);
      await api.deleteContact(id);
      showToast(true, { title: "Sukses", description: "Pesan berhasil dihapus!" });
      fetchContacts();
      setIsModalOpen(false);
    } catch (error) {
      showToast(false, { title: "Gagal", description: "Gagal menghapus pesan." });
    } finally {
      setIsDeleting(false);
    }
  };

  const showToast = (success, message) => {
    setToast({ show: true, success, message });
    setTimeout(() => setToast({ show: false }), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = contacts.filter(c => !c.isRead).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Kelola Pesan Kontak
        </h2>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {unreadCount} belum dibaca
          </span>
        )}
      </div>

      {toast.show && (
        <AnimatedToast
          message={toast.message}
          type={toast.success ? "success" : "error"}
          onClose={() => setToast({ show: false })}
        />
      )}

      {isFetching ? (
        <LoadingSpinner size="lg" />
      ) : contacts.length === 0 ? (
        <div className="text-center py-12">
          <FiMail className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Belum ada pesan masuk.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {contacts.map((contact, index) => (
              <motion.div
                key={contact._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  contact.isRead 
                    ? "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600" 
                    : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                }`}
                onClick={() => handleViewMessage(contact)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {!contact.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                        {contact.name}
                      </h4>
                      {contact.isReplied && (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          contact.emailSent 
                            ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400" 
                            : "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400"
                        }`}>
                          {contact.emailSent ? "✉️ Email terkirim" : "💾 Tersimpan"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</p>
                    {contact.subject && (
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                        {contact.subject}
                      </p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {contact.message}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      <FiClock className="text-xs" />
                      {formatDate(contact.createdAt)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Detail Pesan
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Nama</label>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedContact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedContact.email}</p>
                  </div>
                  {selectedContact.phone && (
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Telepon</label>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedContact.phone}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Tanggal</label>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{formatDate(selectedContact.createdAt)}</p>
                  </div>
                </div>

                {selectedContact.subject && (
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Subjek</label>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedContact.subject}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Pesan</label>
                  <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-1">
                    {selectedContact.message}
                  </p>
                </div>

                {selectedContact.isReplied && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <label className="text-sm text-green-600 dark:text-green-400 font-medium">Balasan Anda</label>
                    <p className="text-gray-800 dark:text-gray-100 mt-1">{selectedContact.replyMessage}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Dibalas pada {formatDate(selectedContact.repliedAt)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                {!selectedContact.isReplied && (
                  <motion.button
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsReplyModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiMessageCircle /> Balas
                  </motion.button>
                )}
                <motion.button
                  onClick={() => handleDelete(selectedContact._id)}
                  className="flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                  disabled={isDeleting}
                  whileHover={!isDeleting ? { scale: 1.02 } : {}}
                  whileTap={!isDeleting ? { scale: 0.98 } : {}}
                >
                  {isDeleting ? <FiLoader className="animate-spin" /> : <FiTrash2 />}
                  Hapus
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reply Modal */}
      <AnimatePresence>
        {isReplyModalOpen && selectedContact && (
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
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                Balas Pesan dari {selectedContact.name}
              </h3>

              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Pesan asli:</p>
                <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{selectedContact.message}</p>
              </div>

              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Tulis balasan Anda..."
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
                rows="5"
              ></textarea>

              <div className="flex gap-3 mt-4">
                <motion.button
                  onClick={handleReply}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                  disabled={isReplying}
                  whileHover={!isReplying ? { scale: 1.02 } : {}}
                  whileTap={!isReplying ? { scale: 0.98 } : {}}
                >
                  {isReplying ? <FiLoader className="animate-spin" /> : <FiCheck />}
                  {isReplying ? "Menyimpan..." : "Simpan Balasan"}
                </motion.button>
                <motion.button
                  onClick={() => {
                    setIsReplyModalOpen(false);
                    setReplyMessage("");
                  }}
                  className="flex items-center justify-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiX /> Batal
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContactAdmin;
