/* /** @type {import('tailwindcss').Config} 
export default {
  content: [
    "./index.html",
    "./src/**.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      placeholderColor: {
        white: "#ffffff",
      },
      colors: {
        primary: "#f0f2f5",
        secondary: "#F94C10",
        tertiary: "#222222",
        slate: {
          10: "#f1f3f4",
        },
        green: {
          50: "#30af5b",
          90: "#292c27",
        },
        gray: {
          10: "#EEEEEE",
          20: "#A2A2A2",
          30: "#7b7b7b",
          50: "#585858",
          90: "#141414",
        },
      },
      spacing: {
        5: "1.25rem",
        10: "2.5rem",
      },
      screens: {
        xs: "400px",
        "3xl": "1680px",
        "4xl": "2200px",
      },
      maxWidth: {
        "10xl": "1512px",
      },
      borderRadius: {
        "5xl": "40px",
      },
      fontFamily: {
        tangerine: ['"Tangerine"', "cursive"],
        alegreya: ["Alegreya"],
      },
      animation: {
        rotate: "rotate  18s linear infinite",
      },
      keyframes: {
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
