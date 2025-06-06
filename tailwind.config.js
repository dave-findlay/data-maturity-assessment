/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7e6',
          100: '#fdecc0',
          200: '#fbd896',
          300: '#f9c46c',
          400: '#f7b042',
          500: '#E0BF70', // Main primary color (warm gold/beige)
          600: '#d4a85a',
          700: '#b8924e',
          800: '#9c7c42',
          900: '#806636',
        },
        secondary: {
          50: '#f4e8eb',
          100: '#e3c2c9',
          200: '#d19ca7',
          300: '#bf7685',
          400: '#ad5063',
          500: '#BB5F77', // Main secondary color (muted rose/burgundy)
          600: '#a5556b',
          700: '#8f4a5f',
          800: '#793f53',
          900: '#633447',
        },
        accent: {
          50: '#fdeaea',
          100: '#f9c5c6',
          200: '#f5a0a2',
          300: '#f17b7e',
          400: '#ed565a',
          500: '#BF3B3D', // Fuse Data red
          600: '#ab3537',
          700: '#972f31',
          800: '#83292b',
          900: '#6f2325',
        },
        teal: {
          50: '#e8f4f6',
          100: '#c2e3e8',
          200: '#9cd2da',
          300: '#76c1cc',
          400: '#50b0be',
          500: '#6EB1C2', // Fuse Data blue/teal
          600: '#629faf',
          700: '#568d9c',
          800: '#4a7b89',
          900: '#3e6976',
        },
        green: {
          50: '#eef6ed',
          100: '#d0e7cc',
          200: '#b2d8ab',
          300: '#94c98a',
          400: '#76ba69',
          500: '#76BA68', // Fuse Data green
          600: '#6aa85e',
          700: '#5e9654',
          800: '#52844a',
          900: '#467240',
        },
        purple: {
          50: '#f1ecf4',
          100: '#dcc9e3',
          200: '#c7a6d2',
          300: '#b283c1',
          400: '#9d60b0',
          500: '#8B5EA2', // Fuse Data purple
          600: '#7d5592',
          700: '#6f4c82',
          800: '#614372',
          900: '#533a62',
        }
      }
    },
  },
  plugins: [],
} 