/* eslint-env node */

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ghost: "#EEF2FF",
        raisin: "#221F2E",
        platinum: "#E1E1E0",
        cerulean: "#24B5DC",
        yonder: "#4C66A4",
        rebecca: "#6B3296",
      },
    },
  },
  plugins: [],
};
