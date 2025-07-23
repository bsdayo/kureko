import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  nitro: {
    cloudflare: {
      nodeCompat: true,
    },
  },

  css: ['~/assets/css/tailwind.css', '~/assets/css/typography.css'],

  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()],
  },

  components: {
    dirs: [
      {
        path: '~/components/ui',
        extensions: ['.vue'],
        pathPrefix: false,
      },
      '~/components',
    ],
  },

  modules: ['@nuxtjs/color-mode'],

  runtimeConfig: {
    public: {
      pocketbaseUrl: '',
    },
  },
})
