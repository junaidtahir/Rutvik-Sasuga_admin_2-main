/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      bordercolor: "#D5DDEC",
      lightgray: "#F5F5F5",
      red: "#D8352F",
      typography: "#959EB0",
      black: "#353A3F",
      darkBlack: "#021840",
      gray: "#9E9E9E",
      gray50: "rgba(208, 208, 208, 0.5)",
      lightblue: "#52678E",
      borderGradient:
        "linear-gradient(270deg, rgba(0, 0, 0, 0.30) 0%, rgba(255, 255, 255, 0.30) 0.01%, rgba(30, 30, 30, 0.30) 48.96%, rgba(255, 255, 255, 0.30) 100%)",
    },
    extend: {
      boxShadow: {
        Shidbar: "0px 2px 5px 0px rgba(172, 172, 190, 0.24)",
      },
    },
  },
  plugins: [],
};
