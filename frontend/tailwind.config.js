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
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      },
      boxShadow: {
        'earth': '0 4px 20px -2px rgba(139, 69, 19, 0.08), 0 2px 6px -1px rgba(139, 69, 19, 0.04)',
        'earth-lg': '0 10px 25px -3px rgba(139, 69, 19, 0.12), 0 4px 10px -2px rgba(139, 69, 19, 0.06)',
        'glow-terracotta': '0 0 20px rgba(200, 90, 50, 0.25)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translate3d(0, 16px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translate3d(0, -16px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale3d(0.95, 0.95, 1)' },
          '100%': { opacity: '1', transform: 'scale3d(1, 1, 1)' },
        },
        scaleDown: {
          '0%': { opacity: '1', transform: 'scale3d(1, 1, 1)' },
          '100%': { opacity: '0', transform: 'scale3d(0.95, 0.95, 1)' },
        },
        slideInRight: {
          '0%': { transform: 'translate3d(100%, 0, 0)' },
          '100%': { transform: 'translate3d(0, 0, 0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translate3d(-100%, 0, 0)' },
          '100%': { transform: 'translate3d(0, 0, 0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translate3d(0, 24px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(200, 90, 50, 0.4)' },
          '50%': { opacity: '0.9', boxShadow: '0 0 0 8px rgba(200, 90, 50, 0)' },
        },
        gentlePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        timelinePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.08)', opacity: '0.85' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        popBounce: {
          '0%': { opacity: '0', transform: 'scale3d(0.72, 0.72, 1) translateY(24px)' },
          '50%': { opacity: '1', transform: 'scale3d(1.06, 1.06, 1) translateY(-6px)' },
          '75%': { transform: 'scale3d(0.98, 0.98, 1) translateY(2px)' },
          '100%': { opacity: '1', transform: 'scale3d(1, 1, 1) translateY(0)' },
        },
        cartWiggle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '20%': { transform: 'scale(1.18) rotate(-14deg)' },
          '40%': { transform: 'scale(1.22) rotate(12deg)' },
          '60%': { transform: 'scale(1.15) rotate(-8deg)' },
          '80%': { transform: 'scale(1.06) rotate(4deg)' },
        },
        sparkleFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg) scale(1)', opacity: '0.85' },
          '50%': { transform: 'translateY(-8px) rotate(180deg) scale(1.25)', opacity: '1' },
        },
        goldHaloGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(233, 196, 106, 0.7)' },
          '50%': { boxShadow: '0 0 0 14px rgba(233, 196, 106, 0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeOut: 'fadeOut 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeInUp: 'fadeInUp 340ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeInDown: 'fadeInDown 340ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        scaleUp: 'scaleUp 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        scaleDown: 'scaleDown 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideInRight: 'slideInRight 320ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideInLeft: 'slideInLeft 320ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideUp: 'slideUp 320ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        float: 'float 3s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        gentlePulse: 'gentlePulse 2.5s ease-in-out infinite',
        timelinePulse: 'timelinePulse 1.8s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
        popBounce: 'popBounce 450ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        cartWiggle: 'cartWiggle 750ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
        sparkleFloat: 'sparkleFloat 2.5s ease-in-out infinite',
        goldHalo: 'goldHaloGlow 2s infinite',
        silkMesh: 'silkMesh 14s ease infinite',
        chromaText: 'chromaText 5s linear infinite',
        blob1: 'blobDrift1 12s ease-in-out infinite',
        blob2: 'blobDrift2 15s ease-in-out infinite',
        blob3: 'blobDrift3 18s ease-in-out infinite',
        needleBob: 'needleBob 2.5s ease-in-out infinite',
        tickerSlide: 'tickerSlide 26s linear infinite',
      }
    },
  },
  plugins: [],
}
