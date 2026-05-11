/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],

  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0B1020',
          secondary: '#151C2E',
          card: '#1A2240',
        },

        accent: {
          blue: '#4DA2FF',
          purple: '#7B61FF',
          glow: '#89C2FF',
        },

        text: {
          primary: '#FFFFFF',
          secondary: '#A8B3CF',
          muted: '#5A6480',
        },
      },
    },
  },

  plugins: [],
}