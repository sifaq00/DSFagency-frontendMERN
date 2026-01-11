"use client";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import logoWhite from "../assets/logo-white.png";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef(null);
  // Close mobile menu on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

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
      {/* MOBILE MENU + BACKDROP */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{
          background: isOpen ? "rgba(20,20,20,0.35)" : "rgba(20,20,20,0)",
          backdropFilter: isOpen ? "blur(6px)" : "none",
        }}
        aria-hidden={!isOpen}
      >
        <nav
          ref={mobileMenuRef}
          className={`absolute top-0 right-0 h-full w-4/5 max-w-xs bg-surface shadow-xl border-l border-border transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-2">
              <img src={logoWhite} alt="Logo" className="w-8 h-auto dark:brightness-100 brightness-0" />
              <span className="font-bold text-lg text-primary">Digital Agency</span>
            </div>
            <button
              className="text-text-primary p-1 rounded-full hover:bg-primary/10 transition"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup Menu"
            >
              <X size={28} />
            </button>
          </div>
          <ul className="flex flex-col px-6 py-6 gap-4 text-text-secondary text-lg font-medium">
            {["About", "Values", "Clients", "Testimonials", "Services", "Contacts"].map((item) => (
              <li
                key={item}
                onClick={() => handleScrollToSection(item)}
                className="cursor-pointer hover:text-primary transition relative group py-2"
              >
                <span className="group-hover:underline group-hover:decoration-primary group-hover:decoration-2 transition-all">{item.replace(/([A-Z])/g, " $1").trim()}</span>
              </li>
            ))}
            <a
              href="https://wa.me/6285643610817"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 py-2 rounded-full bg-primary text-white font-semibold shadow-glow text-center hover:bg-primary-dark transition"
            >
              Hubungi
            </a>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
