import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import api from "../api/axios";

const DEFAULT_ABOUT_IMAGE = "https://cdn.builder.io/api/v1/image/assets/a4bcc66c8e6243ab9c4aea4abeb04592/ae659ff6a3de1a351bb7e304a29e7fd3995beb833d99d3425031561b7bf6dd9a";

const AboutUs = () => {
  const [aboutContent, setAboutContent] = useState("");
  const [advantages, setAdvantages] = useState([]);
  const [aboutImage, setAboutImage] = useState(DEFAULT_ABOUT_IMAGE);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      const res = await api.getAboutUs();
      setAboutContent(res.data.content || "");
      setAdvantages(res.data.advantages || []);
      setAboutImage(res.data.aboutImage || DEFAULT_ABOUT_IMAGE);
    } catch (err) {
      console.error("Gagal mengambil data About Us:", err);
    }
  };

  return (
    <section
      id="About"
      className="relative w-full bg-surface pt-24 pb-24"
    >
      
     <div className="relative max-w-[1200px] mx-auto px-6">

    {/* ===== GLOW PINNED KE CONTENT ===== */}
    <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-primary/20 blur-[160px]" />
    <div className="pointer-events-none absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-primary/10 blur-[140px]" />
        {/* TITLE */}
        <h2
          className="text-5xl font-extrabold tracking-tight text-text-primary text-center max-md:text-3xl"
          data-aos="fade-up"
        >
          About <span className="text-primary">Us</span>
        </h2>

        <p
          className="mt-6 max-w-2xl mx-auto text-center text-text-secondary text-lg max-md:text-base"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Kami adalah partner digital yang fokus pada pertumbuhan bisnis
          melalui strategi modern, kreatif, dan terukur.
        </p>

        {/* ===== MAIN CONTENT ===== */}
        <div className="mt-20 flex items-center gap-14 max-md:flex-col">
          
          {/* IMAGE + BACKGROUND GLOW */}
          <div
            className="w-1/2 max-md:w-full relative"
            data-aos="fade-right"
          >
            {/* GLOW DI BELAKANG IMAGE */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <div className="w-[85%] h-[85%] rounded-3xl bg-primary/40 blur-[140px]" />
            </div>

            {/* IMAGE WRAPPER */}
            <div className="relative">
              <img
                src={aboutImage}
                alt="About us"
                className="w-full aspect-square object-cover drop-shadow-[0_25px_50px_rgba(0,0,0,0.55)]"
              />
            </div>
          </div>

          {/* TEXT */}
          <div
            className="w-1/2 max-md:w-full"
            data-aos="fade-left"
          >
            <p className="text-xl leading-relaxed text-text-secondary max-md:text-base">
              {aboutContent || "Memuat konten..."}
            </p>

            <h3 className="mt-10 text-2xl font-semibold text-text-primary">
              Kenapa memilih kami?
            </h3>

            <ul className="mt-6 space-y-4">
              {advantages.length > 0 ? (
                advantages.map((adv, index) => (
                  <li key={index} className="flex gap-4">
                    {/* BULLET SEJAJAR */}
                    <span className="mt-[0.6em] w-2.5 h-2.5 rounded-full bg-primary shadow-glow flex-shrink-0" />
                    <span className="text-text-secondary leading-relaxed">
                      {adv}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-text-muted">Memuat...</li>
              )}
            </ul>

            <a
              href="https://wa.me/6285643610817"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-10 px-8 py-3 rounded-full bg-primary text-white font-semibold shadow-glow hover:bg-primary-dark transition-transform hover:scale-105"
              data-aos="zoom-in"
            >
              Explore Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
