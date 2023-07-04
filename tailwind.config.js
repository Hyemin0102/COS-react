/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        logofont: ["Lato", "serif"],
      },
      colors: {
        brand: "#1B1B1B",
      },
    },
  },
  plugins: [],
};
