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
        midnight: {
          950: '#060913',
          900: '#0B0F19',
          850: '#0F1626',
          800: '#141D32',
          700: '#1C2742',
          600: '#2A3859',
        },
        festive: {
          gold: '#F59E0B',
          goldLight: '#FBBF24',
          goldDark: '#B45309',
          amber: '#F59E0B',
          orange: '#EA580C',
          orangeLight: '#FB923C',
          sparkle: '#FEF08A'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'festive-gradient': 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
        'gold-glow': 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(11, 15, 25, 0) 70%)',
        'midnight-radial': 'radial-gradient(ellipse at top, #141D32 0%, #060913 70%)',
      },
      boxShadow: {
        'gold': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'gold-lg': '0 0 35px -5px rgba(245, 158, 11, 0.45)',
        'sparkle': '0 0 15px rgba(254, 240, 138, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
