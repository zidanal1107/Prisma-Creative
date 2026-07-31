/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#0F0F11",
          800: "#18181B",
          700: "#27272A",
        },
        accent: {
          gold: "#D4AF37",
          white: "#F4F4F5",
          muted: "#A1A1AA",
        },
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "sans-serif"],
        serif: ["Cormorant Garamond", "serif"],
      },
    },
  },
  plugins: [],
};
