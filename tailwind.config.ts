import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B3A5C',
          50: '#EDF2F8',
          100: '#CCDAEC',
          200: '#99B5D9',
          300: '#6690C6',
          400: '#3D6DAE',
          500: '#1B3A5C',
          600: '#152E49',
          700: '#102237',
          800: '#0A1624',
          900: '#050B12',
        },
        sage: {
          DEFAULT: '#4A7C59',
          50: '#EEF4F0',
          100: '#D1E4D7',
          200: '#A3CAB0',
          300: '#75AF89',
          400: '#5A9471',
          500: '#4A7C59',
          600: '#3A6347',
          700: '#2B4A35',
          800: '#1C3123',
          900: '#0E1912',
        },
        gold: {
          DEFAULT: '#C7A84A',
          50: '#FBF5E6',
          100: '#F5E9C3',
          200: '#EBD387',
          300: '#E0BC4B',
          400: '#C7A84A',
          500: '#A8873A',
          600: '#85692D',
          700: '#634E21',
          800: '#413415',
          900: '#201A0B',
        },
        cream: '#F8F6F0',
        charcoal: '#2C3E50',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #EDF2F8 0%, #F8F6F0 55%, #EEF4F0 100%)',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(27, 58, 92, 0.08)',
        card: '0 4px 16px rgba(27, 58, 92, 0.12)',
        'card-hover': '0 8px 24px rgba(27, 58, 92, 0.18)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
