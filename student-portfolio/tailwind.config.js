/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  // darkMode: 'class' lets us drive dark/light with the .theme-dark/.theme-light
  // parent class — we'll use a data attribute approach via a custom variant instead.
  // For simplicity we keep both themes via inline Tailwind classes controlled by the
  // darkMode prop passed down from App.jsx.
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        sky: {
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
      },
      keyframes: {
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'spin-ring': 'spin 0.85s linear infinite',
        'fade-in':   'fadeIn 0.3s ease both',
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
}
