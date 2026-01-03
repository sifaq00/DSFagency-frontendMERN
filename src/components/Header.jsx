"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logoWhite from "../assets/logo-white.png";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      
      {/* BACKDROP (SELALU ADA → NO FLICKER) */}
      <div
        className={`absolute inset-0 transition-opacity duration-300
          backdrop-blur-md bg-background/70
          ${isScrolled ? "opacity-100" : "opacity-0"}
        `}
        style={{ willChange: "opacity" }}
      />

      {/* HEADER CONTENT */}
      <div className="relative w-full max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LOGO (BALIK ✅) */}
        <div className="flex items-center gap-3">
          <img
            src={logoWhite}
            alt="Digital Agency Logo"
            className="w-[44px] h-auto dark:brightness-100 brightness-0"
          />
          <h1 className="text-xl font-bold text-primary">
            Digital Agency
          </h1>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex">
          <ul className="flex gap-8 text-text-secondary font-medium">
            {["About", "Values", "Clients", "Testimonials", "Services", "Contacts"].map((item) => (
              <li
                key={item}
                onClick={() => handleScrollToSection(item)}
                className="relative hover:text-primary cursor-pointer transition group"
              >
                {item.replace(/([A-Z])/g, " $1").trim()}
             
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
              </li>
            ))}
          </ul>
        </nav>

        {/* RIGHT SIDE: Theme Toggle + CTA */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <a
            href="https://wa.me/6285643610817"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-full bg-primary text-white font-semibold shadow-glow hover:bg-primary-dark transition"
          >
            Hubungi
          </a>
        </div>

        {/* MOBILE TOGGLE */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            className="text-text-primary"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-surface border-t border-border">
          <ul className="flex flex-col px-6 py-6 gap-4 text-text-secondary">
            {["About", "Values", "Clients", "Testimonials", "Services", "Contacts"].map((item) => (
              <li
                key={item}
                onClick={() => handleScrollToSection(item)}
                className="cursor-pointer hover:text-primary transition"
              >
                {item}
              </li>
            ))}
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 py-2 text-center rounded-full bg-primary text-white font-semibold"
            >
              Hubungi
            </a>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
