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
      screens: {
        "2xl": { max: "1535px" },
        // => @media (max-width: 1535px) { ... }

        xl: { max: "1279px" },
        // => @media (max-width: 1279px) { ... }

        lg: { max: "1023px" },
        // => @media (max-width: 1023px) { ... }

        md: { max: "867px" },
        // => @media (max-width: 767px) { ... }

        sm: { max: "767px" },
        // => @media (max-width: 639px) { ... }
      },
    },
  },
  plugins: [],
};
