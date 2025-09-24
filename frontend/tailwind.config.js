/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        secondary: '#EC4899',
        dark: '#1F2937',
        background: '#111827',
        text: '#F9FAFB'
      }
    },
  },
  plugins: [],
}
