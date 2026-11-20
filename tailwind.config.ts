import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fb: {
          blue: "#3b5998",
          darkblue: "#2b4170",
          header: "#3b5998",
          light: "#eceff6",
          border: "#d8dfea",
          highlight: "#6d84b4",
          text: "#333333",
          link: "#3b5998",
          gray: "#777777",
          bg: "#eceff6",
          feedbg: "#ffffff",
          panel: "#f7f7f7",
          commentbg: "#eceff5",
        },
      },
      fontFamily: {
        tahoma: ["Tahoma", "Verdana", "Arial", "sans-serif"],
        lucida: ['"Lucida Grande"', "Tahoma", "Verdana", "Arial", "sans-serif"],
      },
      boxShadow: {
        fbsm: "0 1px 2px rgba(0, 0, 0, 0.1)",
        fbbutton: "inset 0 1px 0 rgba(255, 255, 255, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
