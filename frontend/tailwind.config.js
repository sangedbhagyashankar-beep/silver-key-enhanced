/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#d4af37',  // Brand gold
          600: '#b8962e',
          700: '#9a7c25',
          800: '#7c631c',
          900: '#5e4a13',
        },
        charcoal: {
          50: '#f5f5f0',
          100: '#e8e8e0',
          200: '#d0d0c4',
          300: '#b0b0a0',
          400: '#808070',
          500: '#606055',
          600: '#484840',
          700: '#303028',
          800: '#1a1a10',
          900: '#0d0d08',
        },
        cream: '#faf8f3',
        parchment: '#f0ebe0',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Lato"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(13,13,8,0.85) 0%, rgba(26,26,16,0.6) 50%, rgba(13,13,8,0.3) 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #d4af37 0%, #f5d77e 50%, #d4af37 100%)',
      },
      boxShadow: {
        luxury: '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.1)',
        'gold-glow': '0 0 30px rgba(212,175,55,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};
