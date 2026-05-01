import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9e9ff",
          200: "#bcd6ff",
          300: "#8eb9ff",
          400: "#588eff",
          500: "#2f67f6",
          600: "#1b4dd6",
          700: "#183eab",
          800: "#18368a",
          900: "#172f70",
        },
        accent: {
          50: "#fff6ed",
          100: "#ffead5",
          200: "#ffd2aa",
          300: "#ffb46f",
          400: "#ff8a2d",
          500: "#ff6f0a",
          600: "#f25000",
          700: "#c83b04",
          800: "#9f300d",
          900: "#812b0f",
        },
        surface: "#f6f7fb",
        ink: "#1d2939",
        muted: "#667085",
      },
      boxShadow: {
        soft: "0 12px 40px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(255,255,255,0.38), transparent 32%), linear-gradient(135deg, rgba(47,103,246,1) 0%, rgba(24,62,171,1) 52%, rgba(23,47,112,1) 100%)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;

