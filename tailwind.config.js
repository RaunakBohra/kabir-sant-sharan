/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fefdf8',
          100: '#fdfbf0',
          200: '#faf7e1',
          300: '#f6f0c2',
          400: '#f0e68c',
          500: '#f5f5dc', // Main cream
          600: '#e6d5a3',
          700: '#d4c377',
          800: '#c2b04d',
          900: '#b19f2a',
        },
        accent: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d1d1d1',
          400: '#b4b4b4',
          500: '#9a9a9a', // Medium gray for accents
          600: '#818181',
          700: '#6a6a6a',
          800: '#515151',
          900: '#3b3b3b',
        },
        cream: {
          50: '#fefdf8',
          100: '#fdfbf0',
          200: '#faf7e1',
          300: '#f6f0c2',
          400: '#f0e68c',
          500: '#f5f5dc', // Main cream
          600: '#e6d5a3',
          700: '#d4c377',
          800: '#c2b04d',
          900: '#b19f2a',
        },
        dark: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#000000', // Pure black
        }
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}