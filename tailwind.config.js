/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'red-team': '#FF5555',
        'blue-team': '#5555FF',
        'green-team': '#55AA55',
        'yellow-team': '#FFFF55',
      },
    },
  },
  plugins: [],
} 