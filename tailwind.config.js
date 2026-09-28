/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080B0E",
        surface: {
          DEFAULT: "#0E1217",
          hover: "#141820",
          card: "#10141B",
          border: "#1E2430",
          highlight: "#2A3242",
        },
        volt: {
          DEFAULT: "#D4FF00",
          light: "#E3FF4D",
          dim: "rgba(212, 255, 0, 0.15)",
          glow: "rgba(212, 255, 0, 0.4)",
        },
        race: {
          orange: "#FF5500",
          orangeLight: "#FF7733",
          orangeDim: "rgba(255, 85, 0, 0.15)",
        },
        brand: {
          DEFAULT: "#D4FF00",
          accent: "#FF5500",
          cyan: "#00F0FF",
          emerald: "#10B981",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "marquee": "marquee 35s linear infinite",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { opacity: "0.4", filter: "drop-shadow(0 0 8px rgba(212, 255, 0, 0.4))" },
          "50%": { opacity: "0.8", filter: "drop-shadow(0 0 16px rgba(212, 255, 0, 0.8))" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        }
      },
      boxShadow: {
        "neon-volt": "0 0 25px -2px rgba(212, 255, 0, 0.35)",
        "neon-orange": "0 0 25px -2px rgba(255, 85, 0, 0.35)",
        "neon-cyan": "0 0 25px -2px rgba(0, 240, 255, 0.35)",
        "card-glow": "0 0 30px -5px rgba(212, 255, 0, 0.08)",
      }
    },
  },
  plugins: [],
};
