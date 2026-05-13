/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hospital: {
          blue: '#4A90D9',
          green: '#5CB85C',
          yellow: '#F5A623',
          light: '#F4F7FB',
          dark: '#2C3E50'
        }
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
