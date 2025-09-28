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
          100: '#221f3d',
          200: '#0f0d23',
          
        },
        accent: '#c8dde6ff',
      },
    },
  },
  plugins: [],
}