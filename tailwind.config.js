/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#ebf0f8',
          100: '#d0dff0',
          200: '#a8c0d8',
          300: '#7a9dc0',
          400: '#507099',
          500: '#344c7c',
          600: '#2b3f6a',
          700: '#223458',
          800: '#1b2b4a',
          900: '#132035',
          950: '#0b1525',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      fontFamily: {
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'gold':      '0 0 20px rgba(245,158,11,0.2)',
        'gold-lg':   '0 0 40px rgba(245,158,11,0.35)',
        'card':      '0 4px 24px rgba(11,21,37,0.55)',
        'card-hover':'0 12px 40px rgba(11,21,37,0.75)',
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease-out forwards',
        'slide-up':   'slideUp 0.7s ease-out forwards',
        'pulse-gold': 'pulseGold 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(28px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseGold: { '0%,100%': { opacity: '0.15' }, '50%': { opacity: '0.3' } },
      },
    },
  },
  plugins: [],
};
