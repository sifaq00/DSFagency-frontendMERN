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
  FiUsers,
  FiBarChart2,
  FiTrendingUp,
  FiMonitor,
  FiSmartphone,
  FiTablet,
  FiEye,
  FiUserCheck,
  FiMail,
  FiLayout,
  FiShare2,
} from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import AboutUsAdmin from "./admin/AboutUsAdmin";
import ValuesAdmin from "./admin/ValuesAdmin";
import TestimonialsAdmin from "./admin/TestimonialsAdmin";
import ServiceCardAdmin from "./admin/ServiceCardAdmin";
import ServiceDetailAdmin from "./admin/ServiceDetailAdmin";
import ClientsAdmin from "./admin/ClientsAdmin";
import ContactAdmin from "./admin/ContactAdmin";
import HeroAdmin from "./admin/HeroAdmin";
import SettingsAdmin from "./admin/SettingsAdmin";

const DashboardContent = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDays, setSelectedDays] = useState(14);

  useEffect(() => {
    document.title = "Dashboard | DSF Digital Agency";
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const { data } = await api.getAnalytics(14);
        setAnalytics(data);
      } catch (err) {
        setError(err.response?.data?.message || "Gagal memuat analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (!loading) {
      const fetchChartData = async () => {
        try {
          setChartLoading(true);
          const { data } = await api.getAnalytics(selectedDays);
          setAnalytics(data);
        } catch (err) {
          setError(err.response?.data?.message || "Gagal memuat data grafik");
        } finally {
          setChartLoading(false);
        }
      };

      fetchChartData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDays]);

  const summaryCards = [
    {
      label: "Total Pengguna",
      value: analytics?.totals?.users ?? 0,
      icon: <FiUsers className="text-2xl" />, 
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Klien",
      value: analytics?.totals?.clients ?? 0,
      icon: <FiUsers className="text-2xl" />, 
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      label: "Testimoni",
      value: analytics?.totals?.testimonials ?? 0,
      icon: <FiMessageSquare className="text-2xl" />, 
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Kartu Layanan",
      value: analytics?.totals?.serviceCards ?? 0,
      icon: <FiGrid className="text-2xl" />, 
      gradient: "from-orange-500 to-orange-600",
    },
    {
      label: "Detail Layanan",
      value: analytics?.totals?.serviceDetails ?? 0,
      icon: <FiSettings className="text-2xl" />, 
      gradient: "from-teal-500 to-teal-600",
    },
  ];

  const totalVisit = analytics?.visitorStats?.totalViews ?? analytics?.traffic?.reduce((sum, item) => sum + item.count, 0) ?? 0;
  const uniqueVisitors = analytics?.visitorStats?.uniqueVisitors ?? 0;
  const deviceStats = analytics?.visitorStats?.devices ?? {};
  
  // Prepare device data for display
  const deviceData = [
    { name: "Desktop", value: deviceStats.desktop || 0, icon: <FiMonitor />, color: "#8b5cf6" },
    { name: "Mobile", value: deviceStats.mobile || 0, icon: <FiSmartphone />, color: "#10b981" },
    { name: "Tablet", value: deviceStats.tablet || 0, icon: <FiTablet />, color: "#f59e0b" },
  ].filter(d => d.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <FiBarChart2 className="text-2xl text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence>
              {summaryCards.map((card, index) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05, translateY: -5 }}
                  className={`rounded-xl p-4 shadow-lg bg-gradient-to-r ${card.gradient} text-white cursor-default`}
                >
                  <div className="flex items-center justify-between\">
                    <div>
                      <p className="text-sm opacity-90\">{card.label}</p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="text-3xl font-semibold\"
                      >
                        {card.value}
                      </motion.p>
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="bg-white/20 rounded-full p-3\"
                    >
                      {card.icon}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Grafik Kunjungan Website */}
          <div className="mt-6 rounded-xl bg-white dark:bg-gray-800 shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
              <div className="flex items-center gap-2">
                <FiTrendingUp className="text-2xl text-purple-500" />
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Kunjungan Website
                </h3>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "14 Hari", value: 14 },
                  { label: "1 Bulan", value: 30 },
                  { label: "6 Bulan", value: 180 },
                  { label: "1 Tahun", value: 365 },
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => setSelectedDays(option.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedDays === option.value
                        ? "bg-purple-600 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Visitor Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <FiEye className="text-xl" />
                  <span className="text-sm opacity-90">Total Views</span>
                </div>
                <p className="text-2xl font-bold">{totalVisit.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <FiUserCheck className="text-xl" />
                  <span className="text-sm opacity-90">Unique Visitors</span>
                </div>
                <p className="text-2xl font-bold">{uniqueVisitors.toLocaleString()}</p>
              </div>
              {deviceData.slice(0, 2).map((device) => (
                <div 
                  key={device.name}
                  className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-300">
                    {device.icon}
                    <span className="text-sm">{device.name}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{device.value.toLocaleString()}</p>
                </div>
              ))}
            </div>

            {chartLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics?.traffic || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    interval={selectedDays > 180 ? Math.floor(selectedDays / 12) : selectedDays > 30 ? Math.floor(selectedDays / 10) : "preserveStartEnd"}
                  />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#fff", 
                      borderRadius: "8px", 
                      border: "1px solid #e0e0e0" 
                    }} 
                  />
                  <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: "#8b5cf6", r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-6 rounded-xl bg-white dark:bg-gray-800 shadow-md p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Konten kunci</p>
                <p className="text-gray-800 dark:text-white font-semibold">
                  About: {analytics?.contentStatus?.aboutSections ? "Tersedia" : "Belum diisi"} | Values: {analytics?.contentStatus?.valuesSections ? "Tersedia" : "Belum diisi"}
                </p>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Terakhir diperbarui: {analytics?.lastUpdated ? new Date(analytics.lastUpdated).toLocaleString("id-ID") : "-"}
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    
    // Fetch unread contact count
    const fetchUnreadCount = async () => {
      try {
        const response = await api.getUnreadCount();
        setUnreadCount(response.data.count || 0);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };
    fetchUnreadCount();
  }, [navigate]);

  // Refresh unread count when switching to contact section
  useEffect(() => {
    if (activeSection === "contact") {
      const fetchUnreadCount = async () => {
        try {
          const response = await api.getUnreadCount();
          setUnreadCount(response.data.count || 0);
        } catch (error) {
          console.error("Error fetching unread count:", error);
        }
      };
      fetchUnreadCount();
    }
  }, [activeSection]);

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
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white p-6 flex flex-col overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          <ul className="space-y-3 flex-1">
            {[
              { name: "dashboard", label: "Dashboard", icon: <FiHome className="text-lg" /> },
              { name: "contact", label: "Pesan Kontak", icon: <FiMail className="text-lg" />, badge: unreadCount },
              { name: "hero", label: "Hero Section", icon: <FiLayout className="text-lg" /> },
              { name: "about", label: "About Us", icon: <FiInfo className="text-lg" /> },
              { name: "values", label: "Values", icon: <FiTarget className="text-lg" /> },
              { name: "clients", label: "Clients", icon: <FiUsers className="text-lg" /> },
              { name: "testimonials", label: "Testimonials", icon: <FiMessageSquare className="text-lg" /> },
              { name: "service-card", label: "Service Card", icon: <FiGrid className="text-lg" /> },
              { name: "service-detail", label: "Service Detail", icon: <FiSettings className="text-lg" /> },
              { name: "settings", label: "Pengaturan", icon: <FiShare2 className="text-lg" /> },
            ].map((section) => (
              <li
                key={section.name}
                className={`cursor-pointer p-2 rounded flex items-center gap-2 ${
                  activeSection === section.name ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                onClick={() => setActiveSection(section.name)}
              >
                {section.icon}
                <span className="flex-1">{section.label}</span>
                {section.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {section.badge}
                  </span>
                )}
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
        <div className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeSection === "dashboard" && <DashboardContent />}
            {activeSection === "contact" && <ContactAdmin />}
            {activeSection === "hero" && <HeroAdmin />}
            {activeSection === "about" && <AboutUsAdmin />}
            {activeSection === "values" && <ValuesAdmin />}
            {activeSection === "clients" && <ClientsAdmin />}
            {activeSection === "testimonials" && <TestimonialsAdmin />}
            {activeSection === "service-card" && <ServiceCardAdmin />}
            {activeSection === "service-detail" && <ServiceDetailAdmin />}
            {activeSection === "settings" && <SettingsAdmin />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;