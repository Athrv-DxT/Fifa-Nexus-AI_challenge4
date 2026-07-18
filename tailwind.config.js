/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            50: '#e8f0fe',
            100: '#c2dbfc',
            500: '#1a73e8', // Google Cloud Blue
            600: '#1557b0',
            700: '#174ea6',
          },
          gold: {
            500: '#D4AF37', // FIFA Gold
            600: '#AA882C',
          },
          dark: {
            950: '#060814',
            900: '#0b0f19', // Primary dark canvas
            800: '#111827', // Card dark background
            700: '#1f2937', // Border / inner element dark
            600: '#374151',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
