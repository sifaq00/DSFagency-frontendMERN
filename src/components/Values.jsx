import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiTarget, FiStar, FiHeart, FiZap, FiAward } from "react-icons/fi";
import api from "../api/axios";

const Values = () => {
  const [activeTab, setActiveTab] = useState("vision");
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });
  }, []);

  useEffect(() => {
    const fetchValues = async () => {
      try {
        const res = await api.getValues();
        setVision(res.data.vision);
        setMission(res.data.mission);
      } catch (err) {
        console.error("Gagal mengambil data Values:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchValues();
  }, []);

  const coreValues = [
    { icon: <FiStar />, label: "Quality", color: "from-orange-500 to-amber-600" },
    { icon: <FiHeart />, label: "Integrity", color: "from-rose-500 to-pink-600" },
    { icon: <FiZap />, label: "Innovation", color: "from-amber-500 to-yellow-500" },
    { icon: <FiAward />, label: "Excellence", color: "from-orange-600 to-red-500" },
  ];

  return (
    <section
      id="Values"
      className="relative w-full bg-surface pt-24 pb-24"
    >
      <div className="relative max-w-[1200px] mx-auto px-6">
        {/* ===== GLOW ORANGE ===== */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-primary/15 blur-[160px]" />
        <div className="pointer-events-none absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-primary/10 blur-[140px]" />

        {/* TITLE */}
        <h2
          className="text-5xl font-extrabold tracking-tight text-text-primary text-center max-md:text-3xl"
          data-aos="fade-up"
        >
          Our <span className="text-primary">Values</span>
        </h2>

        <p
          className="mt-6 max-w-3xl mx-auto text-center text-text-secondary text-lg max-md:text-base"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Kami didorong oleh komitmen terhadap kualitas, transparansi,
          dan dampak nyata bagi pertumbuhan bisnis klien.
        </p>

        {/* CORE VALUES ICONS */}
        <div 
          className="mt-12 flex justify-center gap-6 flex-wrap"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          {coreValues.map((value, index) => (
            <motion.div
              key={value.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white text-2xl shadow-lg`}>
                {value.icon}
              </div>
              <span className="text-sm font-medium text-text-secondary">{value.label}</span>
            </motion.div>
          ))}
        </div>

        {/* TAB BUTTONS */}
        <div
          className="mt-12 flex justify-center gap-6 max-md:flex-col max-md:items-center"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {[
            { id: "vision", label: "Vision", icon: <FiEye /> },
            { id: "mission", label: "Mission", icon: <FiTarget /> }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 px-10 py-3 rounded-full text-lg font-semibold transition-all duration-300
                ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-glow"
                    : "border border-border text-text-secondary hover:bg-white/5 hover:border-primary/50"
                }
              `}
            >
              <span className={activeTab === tab.id ? "text-white" : "text-primary"}>{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* CONTENT CARD */}
        <div
          className="mt-16 max-w-4xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="relative rounded-3xl bg-background/60 backdrop-blur-xl border border-border p-12 max-md:p-8 shadow-soft overflow-hidden">
            {/* Decorative gradient bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500" />
            
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-3 py-8"
                >
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-text-muted text-lg">Memuat data...</span>
                </motion.div>
              ) : activeTab === "vision" ? (
                <motion.div
                  key="vision"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-xl shadow-lg shadow-orange-500/20">
                      <FiEye />
                    </div>
                    <h3 className="text-3xl font-bold text-text-primary">
                      Our Vision
                    </h3>
                  </div>
                  <p className="text-xl leading-relaxed text-text-secondary max-md:text-base pl-16 max-md:pl-0">
                    {vision}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="mission"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xl shadow-lg shadow-amber-500/20">
                      <FiTarget />
                    </div>
                    <h3 className="text-3xl font-bold text-text-primary">
                      Our Mission
                    </h3>
                  </div>
                  <p className="text-xl leading-relaxed text-text-secondary max-md:text-base pl-16 max-md:pl-0">
                    {mission}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Values;