import { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import { FiSave, FiLoader, FiEye, FiType, FiLink, FiImage, FiUpload, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedToast from "../../components/AnimatedToast";
import LoadingSpinner from "../../components/LoadingSpinner";

const HeroAdmin = () => {
  const [formData, setFormData] = useState({
    badgeText: "",
    headline: "",
    subheadline: "",
    ctaText: "",
    ctaLink: "",
    secondaryCtaText: "",
    secondaryCtaLink: "",
    heroImage: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState({ show: false, success: false, message: "" });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      setIsFetching(true);
      const response = await api.getHero();
      if (response.data) {
        setFormData({
          badgeText: response.data.badgeText || "",
          headline: response.data.headline || "",
          subheadline: response.data.subheadline || "",
          ctaText: response.data.ctaText || "",
          ctaLink: response.data.ctaLink || "",
          secondaryCtaText: response.data.secondaryCtaText || "",
          secondaryCtaLink: response.data.secondaryCtaLink || "",
          heroImage: response.data.heroImage || "",
        });
        if (response.data.heroImage) {
          setImagePreview(response.data.heroImage);
        }
      }
    } catch (error) {
      console.error("Gagal mengambil data hero:", error);
      showToast(false, { title: "Gagal", description: "Gagal mengambil data hero." });
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast(false, { title: "Error", description: "Ukuran gambar maksimal 5MB" });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(formData.heroImage || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.headline.trim() || !formData.subheadline.trim()) {
      showToast(false, { title: "Validasi", description: "Headline dan subheadline harus diisi!" });
      return;
    }

    try {
      setIsSaving(true);
      
      const submitData = new FormData();
      submitData.append("badgeText", formData.badgeText || "");
      submitData.append("headline", formData.headline || "");
      submitData.append("subheadline", formData.subheadline || "");
      submitData.append("ctaText", formData.ctaText || "");
      submitData.append("ctaLink", formData.ctaLink || "");
      submitData.append("secondaryCtaText", formData.secondaryCtaText || "");
      submitData.append("secondaryCtaLink", formData.secondaryCtaLink || "");
      
      // Only append heroImage if there's a new file or existing URL
      if (imageFile) {
        submitData.append("heroImage", imageFile);
      } else if (formData.heroImage) {
        submitData.append("heroImage", formData.heroImage);
      }
      
      await api.updateHero(submitData);
      showToast(true, { title: "Sukses", description: "Hero section berhasil diperbarui!" });
      setImageFile(null);
      fetchHero();
    } catch (error) {
      console.error("Error saving hero:", error);
      showToast(false, { title: "Gagal", description: error.response?.data?.message || "Gagal menyimpan perubahan." });
    } finally {
      setIsSaving(false);
    }
  };

  const showToast = (success, message) => {
    setToast({ show: true, success, message });
    setTimeout(() => setToast({ show: false }), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Kelola Hero Section
        </h2>
        <motion.button
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            showPreview 
              ? "bg-blue-500 text-white" 
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiEye /> {showPreview ? "Tutup Preview" : "Lihat Preview"}
        </motion.button>
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Badge Text */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiType /> Badge Text
              </label>
              <input
                type="text"
                name="badgeText"
                value={formData.badgeText}
                onChange={handleChange}
                placeholder="Contoh: Digital Marketing Agency"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">Teks badge kecil diatas headline</p>
            </div>

            {/* Headline */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiType /> Headline
              </label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="Contoh: Grow Your Digital Business"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">2 kata pertama normal, sisanya berwarna primary</p>
            </div>

            {/* Subheadline */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiType /> Subheadline
              </label>
              <textarea
                name="subheadline"
                value={formData.subheadline}
                onChange={handleChange}
                placeholder="Deskripsi singkat tentang layanan Anda..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
                rows="2"
              ></textarea>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiLink /> Teks CTA Utama
                </label>
                <input
                  type="text"
                  name="ctaText"
                  value={formData.ctaText}
                  onChange={handleChange}
                  placeholder="Get Started"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiLink /> Link CTA Utama
                </label>
                <input
                  type="text"
                  name="ctaLink"
                  value={formData.ctaLink}
                  onChange={handleChange}
                  placeholder="#Contacts"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiLink /> Teks CTA Sekunder
                </label>
                <input
                  type="text"
                  name="secondaryCtaText"
                  value={formData.secondaryCtaText}
                  onChange={handleChange}
                  placeholder="Learn More"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiLink /> Link CTA Sekunder
                </label>
                <input
                  type="text"
                  name="secondaryCtaLink"
                  value={formData.secondaryCtaLink}
                  onChange={handleChange}
                  placeholder="#About"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Hero Image */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiImage /> Gambar Hero
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Hero Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <FiX />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
                    >
                      Ganti Gambar
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <FiUpload className="text-3xl text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Klik untuk upload gambar</p>
                    <p className="text-xs text-gray-400">PNG, JPG, WEBP (max 5MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              disabled={isSaving}
              whileHover={!isSaving ? { scale: 1.02 } : {}}
              whileTap={!isSaving ? { scale: 0.98 } : {}}
            >
              {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />}
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </motion.button>
          </form>

          {/* Preview */}
          <div className="space-y-4">
            <AnimatePresence>
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 text-white min-h-[450px] relative overflow-hidden"
                >
                  {/* Glow effect */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-orange-500/30 blur-[80px]" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Badge */}
                    <span className="inline-block self-start mb-3 px-3 py-1 text-xs font-semibold text-orange-400 bg-white/10 rounded-full">
                      {formData.badgeText || "Digital Marketing Agency"}
                    </span>

                    {/* Headline */}
                    <h1 className="text-2xl font-bold mb-3 uppercase">
                      {formData.headline ? (
                        <>
                          {formData.headline.split(" ").slice(0, 2).join(" ")}{" "}
                          <span className="text-orange-400">
                            {formData.headline.split(" ").slice(2).join(" ")}
                          </span>
                        </>
                      ) : (
                        <>
                          Grow Your{" "}
                          <span className="text-orange-400">Digital Business</span>
                        </>
                      )}
                    </h1>

                    {/* Subheadline */}
                    <p className="text-sm text-gray-300 mb-4">
                      {formData.subheadline || "Subheadline akan muncul di sini"}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex gap-3 mb-4">
                      <button className="px-4 py-2 text-sm font-semibold rounded-full bg-orange-500 text-white">
                        {formData.ctaText || "Get Started"}
                      </button>
                      <button className="px-4 py-2 text-sm font-semibold rounded-full border border-gray-500 text-white">
                        {formData.secondaryCtaText || "Learn More"}
                      </button>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-auto">
                        <img
                          src={imagePreview}
                          alt="Hero"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-orange-500/30"
                        />
                      </div>
                    )}
                  </div>
                  
                  <p className="absolute bottom-2 right-2 text-xs text-gray-500">
                    * Preview simulasi
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tips */}
            {!showPreview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700"
              >
                <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-3">💡 Tips</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• <strong>Badge:</strong> Identitas singkat bisnis Anda</li>
                  <li>• <strong>Headline:</strong> 2 kata pertama normal, sisanya berwarna oranye</li>
                  <li>• <strong>Subheadline:</strong> Jelaskan value proposition Anda</li>
                  <li>• <strong>CTA:</strong> Gunakan teks yang actionable</li>
                  <li>• <strong>Gambar:</strong> Gunakan ilustrasi atau foto berkualitas tinggi</li>
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HeroAdmin;
