import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  css: ['~/assets/styles/variables.css', '~/assets/styles/typography.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  devtools: { enabled: true },
  modules: ['shadcn-nuxt', '@nuxtjs/color-mode'],
  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },
  colorMode: {
    classSuffix: '',
  },

  runtimeConfig: {
    public: {
      pocketbaseUrl: '',
    },
  },
})
