const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        background: '#f9fafb', // светлый фон
        muted: '#f1f5f9', // серый для карточек/инпутов
        border: '#e2e8f0', // цвет границ
        foreground: '#0f172a', // почти чёрный
        primary: {
          DEFAULT: '#2563eb', // синий Mobbin-style
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f3f4f6',
          foreground: '#1f2937',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#e0f2fe',
          foreground: '#0369a1',
        },
        input: '#f9fafb',
        ring: '#cbd5e1',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1e293b',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#1e293b',
        },
      },
      borderRadius: {
        lg: "1rem",       // округлые карточки
        xl: "1.5rem",
        "2xl": "2rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
        md: "0 4px 6px rgba(0,0,0,0.1)",
        lg: "0 10px 15px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
}
