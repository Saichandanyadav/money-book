/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
 theme: {
    extend: {
      keyframes: {
        'loading-bar': {
          '0%, 100%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0%)' },
        },
      },
      animation: {
        'loading-bar': 'loading-bar 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}