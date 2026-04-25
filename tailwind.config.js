/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Instrument Serif", "Georgia", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        ink: "#0D0F12",
        parchment: "#F8F5EF",
        gold: "#C9952A",
        "gold-light": "#F0D48A",
        cobalt: "#1B3F8B",
        "cobalt-light": "#E8EEF9",
        sage: "#3A6B4F",
        "sage-light": "#E4F0E9",
        rose: "#A0334A",
        "rose-light": "#F5E4E8",
        amber: "#B85C1A",
        "amber-light": "#FAE8D8",
      },
    },
  },
  plugins: [],
};
