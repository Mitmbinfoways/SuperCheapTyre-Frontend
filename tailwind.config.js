/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ED1C24',
        'primary-dark': '#EC1C24',
        dark: '#141414',
        light: '#FAFAFA',
        'medium-gray': '#545454',
        'light-gray': '#E0E0E0',
        'text-secondary': '#5A7184',
        'brand-blue': '#183B56',
        'star-yellow': '#FF9D00',
      },
      fontFamily: {
        lexend: ['"Lexend"', 'sans-serif'],
        roboto: ['"Roboto"', 'sans-serif'],
        'plus-jakarta': ['"Plus Jakarta Sans"', 'sans-serif'],
        'open-sans': ['"Open Sans"', 'sans-serif'],
        'source-serif-regular': ['SourceSerif-regular', 'serif'],
        'source-serif-bold': ['SourceSerif-bold', 'serif'],
      },
    },
  },
  plugins: [],
}
