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
         BRAND COLOR SYSTEM (CSS VARS)
      =============================== */
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "var(--color-primary-dark)",
          light: "var(--color-primary-light)",
        },

        accent: "#FFEDD5",

        background: "var(--color-background)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",

        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
        },
      },

      /* ===============================
         EFFECTS
      =============================== */
      boxShadow: {
        glow: "var(--shadow-glow)",
        soft: "var(--shadow-soft)",
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
