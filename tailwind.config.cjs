/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#8B0000',
        },
        secondary: {
          400: '#FBBF24',
          500: '#FFB300',
          600: '#D97706',
        },
        dark: {
          800: '#1F2937',
          900: '#1C1C1C',
        },
        light: {
          100: '#F5F1E0',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
