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
        // Apple 风的黑、白、灰为主，少量暖色强调
        ink: {
          50: "#f8f8f7",
          100: "#efefee",
          200: "#d8d8d6",
          300: "#b3b3b0",
          400: "#82827f",
          500: "#5b5b58",
          600: "#3d3d3b",
          700: "#2a2a29",
          800: "#1a1a19",
          900: "#0e0e0d",
        },
        accent: {
          // 温暖的强调色 — 类似 iOS 系统的"❤️"红色，克制使用
          DEFAULT: "#d9483a",
          soft: "#fbe8e4",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "sans-serif",
        ],
        serif: ["Source Serif Pro", "Georgia", "serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)",
        soft: "0 8px 32px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;