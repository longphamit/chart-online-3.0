// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/robots', '@nuxtjs/sitemap', '@nuxtjs/apollo','@nuxtjs/i18n'],

  app: {
    head: {
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'vi', iso: 'vi-VN', file: 'vi.json', name: 'Tiếng Việt' }
    ],
    defaultLocale: 'en',
    langDir: 'locales/',
    strategy: 'prefix_except_default'
  },

  robots: {
    UserAgent: '*',
    Disallow: ['/admin', '/private'],
    Allow: '/',
    Sitemap: 'https://tomchart.com/sitemap.xml'
  },

  sitemap: {
    hostname: 'https://tomchart.com',
    routes: [
      '/',
      '/bar',
      '/boxplot',
      '/cubic',
      '/line',
      '/pie',
      '/parabol',
      '/scatter',
    ]
  },

  // Cấu hình Apollo cho Nuxt 3
  apollo: {
    autoImports: true, // Tự động import các composables như useQuery
    clients: {
      default: {
        httpEndpoint: 'https://directus.longpc.site/graphql'
      },
      directus: {
        httpEndpoint: 'https://directus.longpc.site/graphql'
      }
    }
  },

  plugins: ['~/plugins/katex.js'],
  css: ['katex/dist/katex.min.css'],
})