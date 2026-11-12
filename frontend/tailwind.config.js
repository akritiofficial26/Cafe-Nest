/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F6EFE4",
          card: "#FFFCF6",
          deep: "#EFE4D2",
        },
        espresso: {
          DEFAULT: "#3A2A20",
          light: "#5C4433",
        },
        coffee: {
          DEFAULT: "#7A5238",
          light: "#A97D57",
          dark: "#5A3A26",
        },
        mocha: {
          green: "#4B5A3A",
          "green-light": "#6E7F55",
          "green-dark": "#333F27",
        },
        sand: "#C9A876",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Manrope", "sans-serif"],
      },
      keyframes: {
        steam: {
          "0%, 100%": { transform: "translateY(0) scaleY(1)", opacity: "0.55" },
          "50%": { transform: "translateY(-10px) scaleY(1.08)", opacity: "0.9" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        steam1: "steam 3.2s ease-in-out infinite",
        steam2: "steam 3.6s ease-in-out infinite 0.4s",
        steam3: "steam 2.8s ease-in-out infinite 0.8s",
        rise: "rise 0.6s ease-out both",
      },
    },
  },
  plugins: [],
}
