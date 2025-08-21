/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js, jsx, ts, tsx}",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    // metric gradients
    ...Array.from({ length: 16 }, (_, i) => `bg-gradient-metric-${i + 1}`),
    // stat overlays
    "bg-stat-blue",
    "bg-stat-emerald",
    "bg-stat-fuchsia",
    "bg-stat-orange",
    // accent rings & icons
    "bg-accent-ring-blue",
    "bg-accent-ring-cyan",
    "bg-accent-ring-violet",
    "bg-accent-ring-amber",
    "bg-accent-icon-blue",
    "bg-accent-icon-cyan",
    "bg-accent-icon-violet",
    "bg-accent-icon-amber",
  ],
  theme: {
    extend: {
      screens: {
        // 'xm': {'min': '0px', 'max': '639px'},
        // => @media (min-width: 0px and max-width: 639px) { ... }
        sm: { min: "0px", max: "767px" },
        // => @media (min-width: 0px and max-width: 767px) { ... }
        md: { min: "768px " },
        // => @media (min-width: 768px and max-width: 1023px) { ... }
        lg: { min: "1024px", max: "1560" },
        // => @media (min-width: 1024px and max-width: 1279px) { ... }
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        maincolor: "#191A1F",
        secondcolor: "#1E1F26",
        darkmode: "#111827",
        secondlight: "#6B7280",
        secondcontent: "#4B5563",
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
      },
      fontFamily: {
        body: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      fontSize: {
        ss: [
          "0.7rem",
          {
            lineHeight: "1rem",
            // letterSpacing: '-0.01em',
            // fontWeight: '500',
          },
        ],
      },
      gap: {
        1: "1px",
      },
      border: {
        1: "1px",
      },
      gridTemplateRows: {
        // Simple 10 row grid
        10: "repeat(10, minmax(0, 1fr))",
      },
      backgroundImage: {
        /* Stat card overlay gradients */
        "stat-blue":
          "linear-gradient(135deg, rgba(37,99,235,0.10), rgba(37,99,235,0))",
        "stat-emerald":
          "linear-gradient(135deg, rgba(5,150,105,0.10), rgba(5,150,105,0))",
        "stat-fuchsia":
          "linear-gradient(135deg, rgba(192,38,211,0.10), rgba(192,38,211,0))",
        "stat-orange":
          "linear-gradient(135deg, rgba(234,88,12,0.10), rgba(234,88,12,0))",

        /* Accent ring gradients */
        "accent-ring-blue":
          "linear-gradient(135deg, rgba(37,99,235,0.20), rgba(37,99,235,0))",
        "accent-ring-cyan":
          "linear-gradient(135deg, rgba(8,145,178,0.20), rgba(8,145,178,0))",
        "accent-ring-violet":
          "linear-gradient(135deg, rgba(124,58,237,0.20), rgba(124,58,237,0))",
        "accent-ring-amber":
          "linear-gradient(135deg, rgba(245,158,11,0.20), rgba(245,158,11,0))",

        /* Accent icon backgrounds */
        "accent-icon-blue":
          "linear-gradient(135deg, rgba(37,99,235,0.20), rgba(37,99,235,0))",
        "accent-icon-cyan":
          "linear-gradient(135deg, rgba(8,145,178,0.20), rgba(8,145,178,0))",
        "accent-icon-violet":
          "linear-gradient(135deg, rgba(124,58,237,0.20), rgba(124,58,237,0))",
        "accent-icon-amber":
          "linear-gradient(135deg, rgba(245,158,11,0.20), rgba(245,158,11,0))",

        /* Metric progress (16) */
        "gradient-metric-1": "linear-gradient(to right,#2563eb,#3b82f6)",
        "gradient-metric-2": "linear-gradient(to right,#0891b2,#06b6d4)",
        "gradient-metric-3": "linear-gradient(to right,#7c3aed,#8b5cf6)",
        "gradient-metric-4": "linear-gradient(to right,#f59e0b,#fbbf24)",
        "gradient-metric-5": "linear-gradient(to right,#059669,#10b981)",
        "gradient-metric-6": "linear-gradient(to right,#dc2626,#ef4444)",
        "gradient-metric-7": "linear-gradient(to right,#4f46e5,#6366f1)",
        "gradient-metric-8": "linear-gradient(to right,#c026d3,#d946ef)",
        "gradient-metric-9": "linear-gradient(to right,#0d9488,#14b8a6)",
        "gradient-metric-10": "linear-gradient(to right,#e11d48,#fb7185)",
        "gradient-metric-11": "linear-gradient(to right,#0284c7,#38bdf8)",
        "gradient-metric-12": "linear-gradient(to right,#65a30d,#84cc16)",
        "gradient-metric-13": "linear-gradient(to right,#475569,#64748b)",
        "gradient-metric-14": "linear-gradient(to right,#db2777,#ec4899)",
        "gradient-metric-15": "linear-gradient(to right,#ea580c,#f97316)",
        "gradient-metric-16": "linear-gradient(to right,#9333ea,#a855f7)",
      },
    },
  },
  plugins: [
    require("flowbite/plugin")({
      charts: true,
    }),
  ],
};
