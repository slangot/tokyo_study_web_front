/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "bg-pattern": "url('/src/assets/bg-dark.jpg')"
      },
      colors: {
        "autumn": "#EB6323",
        "dark": "#11001C",
        "dark-gold": "#7d5603",
        "dark-grey": "#242424",
        "extra-light-grey": "#333532",
        "full-black": "#141414",
        "full-white": "FFFFFF",
        "gold": "#F6CA5D",
        "light": "#E6D7FA",
        "light-blue": "#63C2FD",
        "light-grey": "#969696",
        "light-white": "#EFF0F2",
        "medium-blue": "#006FFF",
        "medium-grey": "#333532",
        "sky-blue": "#009DFF",
        "spring": "#FF8DC3",
        "success": "rgb(34 197 94)",
        "warning": "rgb(234,179,8)",
        "wrong": "rgb(239 68 68)",
      }
    },
  },
  plugins: [],
};