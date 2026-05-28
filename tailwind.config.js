/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,ts,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#45b071",
        accent: "#ffa44f",
        base: "#eefeff",
      },
    },
  },
};
