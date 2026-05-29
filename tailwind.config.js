/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agro: {
          primary: '#1D9E75',
          dark: '#085041',
          light: '#E1F5EE',
        }
      }
    },
  },
  plugins: [],
}