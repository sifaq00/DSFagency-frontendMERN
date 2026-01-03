import { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import api from "../api/axios";

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.getSettings();
        setSettings(response.data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // Build social links array based on settings
  const getSocialLinks = () => {
    const links = [];
    if (settings?.facebook) links.push({ icon: FaFacebook, url: settings.facebook });
    if (settings?.twitter) links.push({ icon: FaTwitter, url: settings.twitter });
    if (settings?.instagram) links.push({ icon: FaInstagram, url: settings.instagram });
    if (settings?.linkedin) links.push({ icon: FaLinkedin, url: settings.linkedin });
    if (settings?.youtube) links.push({ icon: FaYoutube, url: settings.youtube });
    if (settings?.tiktok) links.push({ icon: FaTiktok, url: settings.tiktok });
    
    // Default links if none configured
    if (links.length === 0) {
      return [
        { icon: FaFacebook, url: "#" },
        { icon: FaTwitter, url: "#" },
        { icon: FaInstagram, url: "#" },
        { icon: FaLinkedin, url: "#" },
      ];
    }
    return links;
  };

  return (
    <footer className="relative w-full bg-surface pt-32 pb-10 overflow-hidden">
      {/* ===== DECORATIVE OBJECTS ===== */}
      <div className="pointer-events-none absolute -left-40 top-1/3 w-[420px] h-[420px] bg-primary/20 blur-[160px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 w-[420px] h-[420px] bg-cyan-400/20 blur-[160px]" />
      <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 w-[900px] h-[1px] bg-gradient-to-r from-transparent via-border to-transparent opacity-60" />

      {/* ===== CONTAINER ===== */}
      <div className="relative max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
          {/* LOGO & DESC */}
          <div className="text-center sm:text-left">
            <p className="text-lg leading-relaxed text-text-secondary">
              <span className="text-text-primary font-semibold">
                {settings?.companyName || "DSF Digital Agency"}
              </span>{" "}
              — {settings?.tagline || "Solusi Digital Marketing untuk UMKM & Bisnis Berkembang."}
            </p>

            <div className="flex justify-center sm:justify-start gap-4 mt-6">
              {getSocialLinks().map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-background/40 backdrop-blur border border-border text-text-secondary hover:text-primary hover:border-primary/50 transition"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS (GESER DIKIT KE KANAN) */}
          <nav className="text-center sm:text-left lg:pl-10">
            <h3 className="text-lg font-semibold text-text-primary uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3 text-text-secondary">
              {["About", "Values", "Clients", "Services", "Contacts"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`#${item}`}
                      className="hover:text-primary transition"
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById(item)
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </nav>

          {/* CONTACT INFO (GESER LEBIH KE KANAN) */}
          <div className="text-center sm:text-left lg:pl-20">
            <h3 className="text-lg font-semibold text-text-primary uppercase">
              Contact Info
            </h3>

            <div className="mt-4 space-y-4 text-text-secondary">
              <div className="flex justify-center sm:justify-start items-center gap-3">
                <FaMapMarkerAlt className="text-primary" />
                <span>{settings?.address || "Bantul, Yogyakarta"}</span>
              </div>

              <div className="flex justify-center sm:justify-start items-center gap-3">
                <FaPhone className="text-cyan-400" />
                <a
                  href={`tel:${settings?.phone?.replace(/\D/g, "") || "085643610817"}`}
                  className="hover:text-cyan-400 transition"
                >
                  {settings?.phone || "0856-4361-0817"}
                </a>
              </div>

              <div className="flex justify-center sm:justify-start items-center gap-3">
                <FaEnvelope className="text-violet-400" />
                <a
                  href={`mailto:${settings?.email || "dsfproject025@gmail.com"}`}
                  className="hover:text-violet-400 transition"
                >
                  {settings?.email || "dsfproject025@gmail.com"}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-10 h-px bg-border opacity-60" />

        {/* BOTTOM */}
        <div className="text-center text-text-secondary text-sm sm:text-base">
          <p>© 2025 {settings?.companyName || "DSF Digital Agency"}. All Rights Reserved.</p>
          <div className="flex justify-center gap-3 mt-2">
            <a href="#" className="hover:text-primary transition">
              Privacy Policy
            </a>
            <span className="opacity-40">|</span>
            <a href="#" className="hover:text-primary transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
