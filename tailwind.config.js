/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        'color-main': 'var(--color-main)',
        'color-second': 'var(--color-second)',
        'color-dark': 'var(--color-dark)',
        'text-main': 'var(--text-main)',
      },
    },
  },
  plugins: [],
};
