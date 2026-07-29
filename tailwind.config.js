/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          light: '#FFFBF0', // Warm Cream
          DEFAULT: '#FFFBF0',
          dark: '#FFEAA7', // Soft Marigold
        },
        gold: {
          light: '#FFD54F',
          DEFAULT: '#FFB300', // Festival Gold
          dark: '#FFA000',
        },
        saffron: {
          DEFAULT: '#FF8F00', // Deep Saffron
          dark: '#E65100',
        },
        red: {
          DEFAULT: '#D32F2F', // Vermilion Red
        },
        green: {
          DEFAULT: '#2E7D32', // Emerald Green
        },
        turquoise: {
          DEFAULT: '#00BCD4', // Bright Turquoise
        },
        charcoal: {
          DEFAULT: '#1E1E1E', // Headlines
        },
        brown: {
          DEFAULT: '#5D4037', // Body text
        }
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(to right bottom, #D32F2F, #FFB300)',
        'gradient-cta': 'linear-gradient(to right, #FF9800, #FFEB3B)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%)',
      },
      boxShadow: {
        'warm': '0 10px 15px -3px rgba(255, 179, 0, 0.2), 0 4px 6px -2px rgba(255, 179, 0, 0.1)',
        'glass': '0 8px 32px 0 rgba(255, 215, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
