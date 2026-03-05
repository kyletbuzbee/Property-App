/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        institutional: {
          slate: "#0f172a", // Slate-900
          navy: "#1e293b", // Slate-800
          charcoal: "#334155", // Slate-700
          border: "#e2e8f0", // Slate-200
          bg: "#f8fafc", // Slate-50
          card: "#ffffff",
        },
        // Dark theme colors used in components
        dark: {
          950: "#0a0a0f", // Very dark background
          900: "#141419", // Dark background
          800: "#1e1e24", // Card background
          700: "#2a2a32", // Border
          600: "#3f3f4a", // Muted text
          500: "#6b6b7b", // Secondary text
          400: "#9ca3af", // Light text on dark
          300: "#d1d5db", // Lighter text
        },
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        // Muted semantic colors
        success: "#059669", // emerald-600
        danger: "#be123c", // rose-700
        warning: "#d97706", // amber-600
        info: "#2563eb", // blue-600

        platinum: "#059669",
        gold: "#d97706",
        silver: "#ea580c",
        hardfail: "#be123c",
        caution: "#7c3aed",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
