/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        desert: {
          500: '#f59e0b',   // desert orange
          600: '#d97706',
          700: '#b45309'
        },
        fort: {
          500: '#1e40af',   // fort blue
          600: '#1e3a8a',
          700: '#1e2a6b'
        }
      },
      fontFamily: {
        rajasthan: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};