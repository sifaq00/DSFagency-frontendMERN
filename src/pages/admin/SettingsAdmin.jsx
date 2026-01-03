import { useState, useEffect } from "react";
import api from "../../api/axios";
import { 
  FiSave, FiLoader, FiMail, FiPhone, FiMapPin, 
  FiInstagram, FiFacebook, FiTwitter, FiLinkedin, FiYoutube
} from "react-icons/fi";
import { FaTiktok, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import AnimatedToast from "../../components/AnimatedToast";
import LoadingSpinner from "../../components/LoadingSpinner";

const SettingsAdmin = () => {
  const [formData, setFormData] = useState({
    // Contact Info
    companyName: "",
    tagline: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    // Social Media
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    youtube: "",
    tiktok: "",
  });
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("contact");
  const [toast, setToast] = useState({ show: false, success: false, message: "" });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsFetching(true);
      const response = await api.getSettings();
      if (response.data) {
        setFormData({
          companyName: response.data.companyName || "",
          tagline: response.data.tagline || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          whatsapp: response.data.whatsapp || "",
          address: response.data.address || "",
          instagram: response.data.instagram || "",
          facebook: response.data.facebook || "",
          twitter: response.data.twitter || "",
          linkedin: response.data.linkedin || "",
          youtube: response.data.youtube || "",
          tiktok: response.data.tiktok || "",
        });
      }
    } catch (error) {
      console.error("Gagal mengambil pengaturan:", error);
      showToast(false, { title: "Gagal", description: "Gagal mengambil pengaturan." });
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      await api.updateSettings(formData);
      showToast(true, { title: "Sukses", description: "Pengaturan berhasil diperbarui!" });
    } catch (error) {
      showToast(false, { title: "Gagal", description: "Gagal menyimpan pengaturan." });
    } finally {
      setIsSaving(false);
    }
  };

  const showToast = (success, message) => {
    setToast({ show: true, success, message });
    setTimeout(() => setToast({ show: false }), 3000);
  };

  const tabs = [
    { id: "contact", label: "Info Kontak", icon: <FiPhone /> },
    { id: "social", label: "Media Sosial", icon: <FiInstagram /> },
  ];

  const socialFields = [
    { name: "instagram", icon: <FiInstagram className="text-pink-500" />, label: "Instagram", placeholder: "https://instagram.com/username" },
    { name: "facebook", icon: <FiFacebook className="text-blue-600" />, label: "Facebook", placeholder: "https://facebook.com/page" },
    { name: "twitter", icon: <FiTwitter className="text-sky-500" />, label: "Twitter/X", placeholder: "https://twitter.com/username" },
    { name: "linkedin", icon: <FiLinkedin className="text-blue-700" />, label: "LinkedIn", placeholder: "https://linkedin.com/company/name" },
    { name: "youtube", icon: <FiYoutube className="text-red-500" />, label: "YouTube", placeholder: "https://youtube.com/@channel" },
    { name: "tiktok", icon: <FaTiktok className="text-gray-800 dark:text-gray-200" />, label: "TikTok", placeholder: "https://tiktok.com/@username" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
    >
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Pengaturan Website
      </h2>

      {toast.show && (
        <AnimatedToast
          message={toast.message}
          type={toast.success ? "success" : "error"}
          onClose={() => setToast({ show: false })}
        />
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 -mb-[2px] ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-500"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {isFetching ? (
        <LoadingSpinner size="lg" />
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Contact Info Tab */}
          {activeTab === "contact" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nama Perusahaan
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="DSF Digital Agency"
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    placeholder="Your Digital Growth Partner"
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiMail /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="info@dsfdigital.com"
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiPhone /> Telepon
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+62 21 xxx xxxx"
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaWhatsapp className="text-green-500" /> WhatsApp
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="628123456789 (tanpa + atau spasi)"
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: 628xxx (akan digunakan untuk link wa.me/628xxx)
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiMapPin /> Alamat
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Jl. Contoh No. 123, Jakarta"
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
                  rows="3"
                ></textarea>
              </div>
            </motion.div>
          )}

          {/* Social Media Tab */}
          {activeTab === "social" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Masukkan URL lengkap akun media sosial Anda. Kosongkan jika tidak ingin menampilkan.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialFields.map((field) => (
                  <div key={field.name} className="relative">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {field.icon} {field.label}
                    </label>
                    <input
                      type="url"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                ))}
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Preview Ikon Social Media:
                </p>
                <div className="flex gap-4">
                  {socialFields.map((field) => (
                    formData[field.name] && (
                      <a
                        key={field.name}
                        href={formData[field.name]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white dark:bg-gray-600 rounded-lg shadow hover:shadow-md transition"
                      >
                        {field.icon}
                      </a>
                    )
                  ))}
                  {!socialFields.some(f => formData[f.name]) && (
                    <p className="text-sm text-gray-400">
                      Belum ada media sosial yang diisi
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full mt-8 flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            disabled={isSaving}
            whileHover={!isSaving ? { scale: 1.02 } : {}}
            whileTap={!isSaving ? { scale: 0.98 } : {}}
          >
            {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />}
            {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
          </motion.button>
        </form>
      )}
    </motion.div>
  );
};

export default SettingsAdmin;
