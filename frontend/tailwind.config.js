/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50: '#FDF6F2',
          100: '#FAE8DF',
          200: '#F4CEBD',
          300: '#EBB097',
          400: '#E07A5F',
          500: '#C85A32', // Primary warm terracotta
          600: '#B04823',
          700: '#8E3618',
          800: '#732C13',
          900: '#53200D',
        },
        cream: {
          50: '#FEFCFA',
          100: '#FDFBF7', // Primary warm cream
          200: '#F7F3E9',
          300: '#EFE8D6',
          400: '#E3D7BD',
          500: '#D5C39F',
        },
        indigo: {
          850: '#152238',
          900: '#1D2D44', // Deep heritage indigo
          950: '#0D1B2A',
        },
        mustard: {
          100: '#FEF9E7',
          300: '#F8E29B',
          400: '#F2CD5C',
          500: '#E9C46A', // Earthy mustard accent
          600: '#D4A328',
          700: '#B2821A',
        },
        coastal: {
          50: '#F0F7F7',
          100: '#DEEDED',
          500: '#3D8B8B',
          700: '#265C5C',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'earth': '0 4px 20px -2px rgba(139, 69, 19, 0.08), 0 2px 6px -1px rgba(139, 69, 19, 0.04)',
        'earth-lg': '0 10px 25px -3px rgba(139, 69, 19, 0.12), 0 4px 10px -2px rgba(139, 69, 19, 0.06)',
      }
    },
  },
  plugins: [],
}
