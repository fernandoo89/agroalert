/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agro: {
          primary: '#15825E',
          dark: '#085041',
          light: '#E1F5EE',
        }
      }
    },
  },
  plugins: [],
}