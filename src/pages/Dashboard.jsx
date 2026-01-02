import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLogOut,
  FiSun,
  FiMoon,
  FiHome,
  FiInfo,
  FiTarget,
  FiMessageSquare,
  FiGrid,
  FiSettings,
} from "react-icons/fi"; // Tambahkan ikon-ikon yang diperlukan
import AboutUsAdmin from "./admin/AboutUsAdmin";
import ValuesAdmin from "./admin/ValuesAdmin";
import TestimonialsAdmin from "./admin/TestimonialsAdmin";
import ServiceCardAdmin from "./admin/ServiceCardAdmin";
import ServiceDetailAdmin from "./admin/ServiceDetailAdmin";

const DashboardContent = () => {
  useEffect(() => {
    document.title = "Dashboard | DSF Digital Agency";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Dashboard
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Tambahkan konten ringkasan di sini */}
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    console.log("Dark mode:", !darkMode); // Cek apakah state berubah
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white p-6">
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          <ul className="space-y-3">
            {[
              { name: "dashboard", icon: <FiHome className="text-lg" /> },
              { name: "about", icon: <FiInfo className="text-lg" /> },
              { name: "values", icon: <FiTarget className="text-lg" /> },
              { name: "testimonials", icon: <FiMessageSquare className="text-lg" /> },
              { name: "service-card", icon: <FiGrid className="text-lg" /> },
              { name: "service-detail", icon: <FiSettings className="text-lg" /> },
            ].map((section) => (
              <li
                key={section.name}
                className={`cursor-pointer p-2 rounded flex items-center gap-2 ${
                  activeSection === section.name ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                onClick={() => setActiveSection(section.name)}
              >
                {section.icon} {/* Tambahkan ikon di sini */}
                {section.name.charAt(0).toUpperCase() + section.name.slice(1)}
              </li>
            ))}
          </ul>
          <button
            onClick={handleLogout}
            className="mt-6 flex items-center justify-center gap-2 bg-red-500 px-4 py-2 rounded hover:bg-red-600 w-full"
          >
            <FiLogOut /> Logout
          </button>
          <button
            onClick={toggleDarkMode}
            className="mt-4 flex items-center justify-center gap-2 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            {darkMode ? (
              <>
                <FiSun className="text-lg" /> Light Mode
              </>
            ) : (
              <>
                <FiMoon className="text-lg" /> Dark Mode
              </>
            )}
          </button>
        </div>

        {/* Konten Utama */}
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {activeSection === "dashboard" && <DashboardContent />}
            {activeSection === "about" && <AboutUsAdmin />}
            {activeSection === "values" && <ValuesAdmin />}
            {activeSection === "testimonials" && <TestimonialsAdmin />}
            {activeSection === "service-card" && <ServiceCardAdmin />}
            {activeSection === "service-detail" && <ServiceDetailAdmin />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;