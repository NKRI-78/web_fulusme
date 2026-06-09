import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--color-primary)",
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
