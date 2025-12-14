// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ['@nuxtjs/sitemap'],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/app.css"],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
  nitro: {
    preset: 'static',
    prerender: {
      routes: [ '/', '/robots.txt']
    }
  },
  ssr: false,
  app: {
    buildAssetsDir: "assets"
  },
  site: {
    url: 'http://localhost'
  }
})