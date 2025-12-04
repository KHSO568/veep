// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxt/image'
  ],
  plugins: ['./plugins/firebase.js'],


  css: ['./assets/css/tailwind.css'],
  i18n: {
    vueI18n: './i18n.config.ts',
    defaultLocale: 'fr'
  },
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },
  compatibilityDate: '2025-12-04'
})