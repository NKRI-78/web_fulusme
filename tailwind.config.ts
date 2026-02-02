import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#10565C",
        "on-primary": "#FFFFFF",
      },
      keyframes: {
        blinkBackground: {
          "0%, 100%": { backgroundColor: "#ffffff" },
          "50%": { backgroundColor: "#ffe5e5" },
        },
      },
      animation: {
        blinkBgSlow: "blinkBackground 2s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
