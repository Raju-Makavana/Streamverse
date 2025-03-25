/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  important: '#root',
  theme: {container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
    extend: {
      colors: {
        primary: '#6C5CE7',
        secondary: '#A29BFE',
        dark: '#2D3436',
      }
    },
  },
  plugins: [],
}