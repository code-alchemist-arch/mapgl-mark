/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        sm: '0px 1px 0px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        sans: ['Open Sans', 'serif', 'sans-serif'],
      },
      colors: {
        'occupancy-low': '#5ba900',
        'occupancy-medium': '#fab525',
        'occupancy-full': '#db3348',
      },
    },
  },
  plugins: [],
};
