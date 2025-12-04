/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        // New Veep color scheme
        veep: {
          orange: '#FF6B35',
          'orange-light': '#FF8C61',
          'orange-dark': '#E85A2A',
          beige: '#FFF8F0',
          'beige-light': '#FFFBF7',
          'beige-dark': '#F5E6D3',
          gray: {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#E5E5E5',
            300: '#D4D4D4',
            400: '#A3A3A3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
          }
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        Baloo: ['Baloo 2', 'sans-serif']
      },
    },
  },
  plugins: [],
}