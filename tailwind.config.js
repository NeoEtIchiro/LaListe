/** @type {import('tailwindcss').Config} */
// filepath: /tailwind.config.js
module.exports = {
  purge: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false, // Désactive les styles de base
  },
  plugins: [],
}

