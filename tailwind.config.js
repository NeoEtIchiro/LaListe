/** @type {import('tailwindcss').Config} */
// filepath: /tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        basicGrey: '#ebebeb',
        callToAction: '#E8535D',
      },
    },
  },
  corePlugins: {
    preflight: false, // Désactive les styles de base
  },
  plugins: [],
}

