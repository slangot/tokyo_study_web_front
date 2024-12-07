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
      // colors: {
      //   "primary": "#653C87",
      //   "secondary": "#520380",
      //   "third": "#3A025B",
      //   "fourth": "#220135",
      //   "medium-dark": "#1A0129",
      //   "dark": "#11001C",
      //   "dark-gray": "rgb(17,24,39)",
      //   "medium-gray": "rgb(112, 112, 112)",
      //   "light": "#E6D7FA",
      //   "dark-purple": "#00011d",
      //   "gold": "rgb(202 138 4)",
      //   "dark-gold": "#7d5603",
      //   "success": "rgb(34 197 94)",
      //   "wrong": "rgb(239 68 68)",
      //   "warning": "rgb(234,179,8)"
      // }
      colors: {
        "light-blue": "#63C2FD",
        "sky-blue": "#009DFF",
        "medium-blue": "#006FFF",
        "gold": "#F6CA5D",
        "white": "FFFFFF",
        "light-white": "#EFF0F2",
        "extra-light-grey": "#333532",
        "light-grey": "#969696",
        "medium-grey": "#333532",
        "dark-grey": "#242424",
        "black": "#141414",
        "autumn": "#EB6323",
        "spring": "#FF8DC3",
        "success": "rgb(34 197 94)",
        "wrong": "rgb(239 68 68)",
        "warning": "rgb(234,179,8)",
        "--------": "",
        "--------": "",
        "--------": "",
        "primary": "#653C87",
        "secondary": "#520380",
        "third": "#3A025B",
        "fourth": "#220135",
        "medium-dark": "#1A0129",
        "dark": "#11001C",
        "dark-gray": "rgb(17,24,39)",
        "medium-gray": "rgb(112, 112, 112)",
        "light": "#E6D7FA",
        "dark-purple": "#00011d",
        "gold": "rgb(202 138 4)",
        "dark-gold": "#7d5603",
      }
    },
  },
  plugins: [],
};