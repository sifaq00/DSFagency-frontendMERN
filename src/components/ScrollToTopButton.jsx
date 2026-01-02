"use client";
import { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi"; // Ikon panah ke atas dari react-icons

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Fungsi untuk menangani scroll
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Fungsi untuk scroll ke atas
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Animasi scroll smooth
    });
  };

  // Tambahkan event listener untuk scroll
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="p-3 bg-orange-400 text-white rounded-full shadow-lg hover:bg-orange-500 transition-all duration-300"
          aria-label="Scroll to top"
        >
          <FiArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;