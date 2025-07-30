import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f8f9ff",
          100: "#f0f3ff",
          200: "#e1e8ff",
          300: "#c7d2ff",
          400: "#a5b4ff",
          500: "#7c3aed",
          600: "#910A67",
          700: "#720455",
          800: "#3C0753",
          900: "#030637",
          950: "#020423",
        },
        // Custom brand colors using your palette
        brand: {
          darkest: "#030637",
          dark: "#3C0753", 
          medium: "#720455",
          light: "#910A67",
        },
        // Semantic colors for light/dark modes
        background: {
          light: "#ffffff",
          dark: "#030637",
        },
        surface: {
          light: "#f8f9ff",
          dark: "#3C0753",
        },
        text: {
          primary: {
            light: "#030637",
            dark: "#ffffff",
          },
          secondary: {
            light: "#3C0753",
            dark: "#e1e8ff",
          },
          muted: {
            light: "#720455",
            dark: "#c7d2ff",
          },
        },
        border: {
          light: "#e1e8ff",
          dark: "#720455",
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #030637 0%, #3C0753 25%, #720455 75%, #910A67 100%)",
        "gradient-brand-reverse": "linear-gradient(135deg, #910A67 0%, #720455 25%, #3C0753 75%, #030637 100%)",
        "gradient-brand-light": "linear-gradient(135deg, #f8f9ff 0%, #e1e8ff 50%, #c7d2ff 100%)",
      },
      boxShadow: {
        "brand-sm": "0 1px 2px 0 rgb(3 6 55 / 0.05)",
        "brand": "0 1px 3px 0 rgb(3 6 55 / 0.1), 0 1px 2px -1px rgb(3 6 55 / 0.1)",
        "brand-md": "0 4px 6px -1px rgb(3 6 55 / 0.1), 0 2px 4px -2px rgb(3 6 55 / 0.1)",
        "brand-lg": "0 10px 15px -3px rgb(3 6 55 / 0.1), 0 4px 6px -4px rgb(3 6 55 / 0.1)",
        "brand-xl": "0 20px 25px -5px rgb(3 6 55 / 0.1), 0 8px 10px -6px rgb(3 6 55 / 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
