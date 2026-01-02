import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion, AnimatePresence } from "framer-motion";
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

  return (
    <section
      id="Values"
      className="relative w-full bg-surface pt-40 pb-40"
    >
      <div className="relative max-w-[1200px] mx-auto px-6">
        {/* ===== GLOW PINNED KE CONTENT ===== */}
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

        {/* TAB BUTTONS */}
        <div
          className="mt-12 flex justify-center gap-6 max-md:flex-col"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {["vision", "mission"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-10 py-3 rounded-full text-lg font-semibold transition-all duration-300
                ${
                  activeTab === tab
                    ? "bg-primary text-white shadow-glow"
                    : "border border-border text-text-secondary hover:bg-white/5"
                }
              `}
            >
              {tab === "vision" ? "Vision" : "Mission"}
            </button>
          ))}
        </div>

        {/* CONTENT CARD */}
        <div
          className="mt-16 max-w-4xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="relative rounded-3xl bg-background/60 backdrop-blur-xl border border-border p-12 max-md:p-8 shadow-soft">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.p
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-text-muted text-lg"
                >
                  Memuat data...
                </motion.p>
              ) : activeTab === "vision" ? (
                <motion.div
                  key="vision"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-3xl font-bold text-text-primary">
                    Our Vision
                  </h3>
                  <p className="mt-6 text-xl leading-relaxed text-text-secondary max-md:text-base">
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
                  <h3 className="text-3xl font-bold text-text-primary">
                    Our Mission
                  </h3>
                  <p className="mt-6 text-xl leading-relaxed text-text-secondary max-md:text-base">
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