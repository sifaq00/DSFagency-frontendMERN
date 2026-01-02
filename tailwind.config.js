/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      /* ===============================
         BRAND COLOR SYSTEM (ORANGE)
      =============================== */
      colors: {
        primary: {
          DEFAULT: "#F97316", // orange utama
          dark: "#EA580C",
          light: "#FDBA74",
        },

        accent: "#FFEDD5",

        background: "#0B0A0F", // dark base
        surface: "#14131A",    // card / section
        border: "#26242D",

        text: {
          primary: "#FFFFFF",
          secondary: "#D1D5DB",
          muted: "#9CA3AF",
        },
      },

      /* ===============================
         EFFECTS
      =============================== */
      boxShadow: {
        glow: "0 0 50px rgba(249,115,22,0.35)",
        soft: "0 10px 40px rgba(0,0,0,0.45)",
      },

      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at bottom, rgba(249,115,22,0.35), transparent 65%)",
      },

      /* ===============================
         ANIMATION (YANG SUDAH ADA)
      =============================== */
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "scroll-left": "scroll 15s linear infinite",
      },
    },
  },
  plugins: ["daisyui"],
};
