/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eden: {
          50: '#f2f8f1',
          100: '#e1efe0',
          200: '#c5e0c3',
          300: '#9bc899',
          400: '#6ca969',
          500: '#468b43',
          600: '#357133',
          700: '#2b5a29',
          800: '#254824',
          900: '#1f3c1f',
          950: '#0c210d',
        },
        oat: {
          50: '#faf8f5',
          100: '#f4f0e9',
          200: '#e9e0d2',
          300: '#dacab3',
          400: '#c7ae8f',
          500: '#b89874',
        },
        amber: {
          warm: '#e68a2e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
