import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import api from "../api/axios";
import heroImg from "../assets/hero.png";

const Hero = () => {
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });
    
    // Fetch hero data from API
    const fetchHero = async () => {
      try {
        const response = await api.getHero();
        setHeroData(response.data);
      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    };
    fetchHero();
  }, []);

  // Handle CTA click
  const handleCtaClick = (link) => {
    if (link) {
      if (link.startsWith("#")) {
        // Scroll to section
        const element = document.querySelector(link);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else if (link.startsWith("http")) {
        // Open external link
        window.open(link, "_blank");
      } else {
        // Navigate to internal route
        window.location.href = link;
      }
    }
  };


  // Pakai hero.png lokal agar load cepat

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background text-text-primary">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-900/20 via-background to-background" />

      {/* Horizon glow */}
      <div className="absolute bottom-[-320px] left-1/2 -translate-x-1/2 w-[1400px] h-[600px] rounded-full bg-primary/40 blur-[160px]" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-[160px] pb-24 max-md:pt-[120px]">
        <div className="flex items-center justify-between gap-14 max-md:flex-col">

          {/* LEFT CONTENT */}
          <div
            className="w-6/12 max-md:w-full max-md:text-center"
            data-aos="fade-right"
          >
            <span className="inline-block mb-6 px-4 py-1 text-sm font-semibold tracking-wide text-primary bg-white/10 rounded-full backdrop-blur">
              {heroData?.badgeText || "Digital Marketing Agency"}
            </span>

            <h1 className="text-[64px] font-extrabold leading-[72px] uppercase max-md:text-4xl max-md:leading-[48px]">
              {heroData?.headline ? (
                <>
                  {heroData.headline.split(" ").slice(0, 2).join(" ")} <br />
                  <span className="text-primary">{heroData.headline.split(" ").slice(2).join(" ")}</span>
                </>
              ) : (
                <>
                  Grow Your <br />
                  <span className="text-primary">Digital Business</span>
                </>
              )}
            </h1>

            <p className="mt-6 text-xl text-text-secondary max-md:text-base">
              {heroData?.subheadline || "Solusi Digital Marketing profesional untuk UMKM dan bisnis yang ingin berkembang lebih cepat dan terukur."}
            </p>

            <div className="flex items-center gap-5 mt-10 max-md:flex-col max-md:items-center">
              <button 
                onClick={() => handleCtaClick(heroData?.ctaLink || "#Contacts")}
                className="px-10 py-3 text-lg font-semibold rounded-full bg-primary hover:bg-primary-dark shadow-glow transition transform hover:scale-105"
              >
                {heroData?.ctaText || "Get Started"}
              </button>

              <button 
                onClick={() => handleCtaClick(heroData?.secondaryCtaLink || "#About")}
                className="px-10 py-3 text-lg font-semibold rounded-full border border-border text-text-primary hover:bg-white/10 transition"
              >
                {heroData?.secondaryCtaText || "Learn More"}
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div
            className="w-6/12 max-md:w-full flex justify-end max-md:justify-center"
            data-aos="fade-left"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-primary/15 blur-2xl -z-10" />
              <img
                src={heroData?.heroImage || heroImg}
                alt="Marketing illustration"
                className="w-full max-w-[1100px] md:max-w-[1100px] sm:max-w-[480px] rounded-2xl object-cover"
                loading="eager"
                style={{ minHeight: 320 }}
              />
            </div>
          </div>

        </div>
      </div>
      {/* BRIDGE KE ABOUT */}
      
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-surface" />
    </section>
  );
};

export default Hero;
