import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dce8ff",
          200: "#b8d1ff",
          300: "#8bb3ff",
          400: "#5d8fff",
          500: "#3366ff",
          600: "#2249db",
          700: "#1a37ad",
          800: "#172d85",
          900: "#152864",
        },
        money: {
          50: "#ecfdf5",
          100: "#d1fae5",
          300: "#6ee7b7",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -8px rgba(15, 23, 42, 0.12)",
        result: "0 20px 45px -15px rgba(5, 150, 105, 0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.45s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
