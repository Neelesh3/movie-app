/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",      // <-- Add this line
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#624affff',
        secondary: '#151312',
        light: {
          100: '#9094e0ff',
          200: '#eeeeeeff',
        },
        dark: {
          100: '#1c1c1eff',
          200: '#121212ff',
          300: '#0a0a0aff',
        },
      },
    },
  },
  plugins: [],
}