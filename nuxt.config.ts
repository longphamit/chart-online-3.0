export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/sitemap', '@nuxtjs/apollo', '@nuxtjs/i18n', 'nuxt-gtag'],

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

  sitemap: {
    hostname: 'https://tomchart.com',
    robots: false,
    i18n: true, // Hỗ trợ đa ngôn ngữ
    // Xác định các nguồn route
    sources: [
      {
        src: async () => {
          const GRAPHQL_ENDPOINT = 'https://directus.longpc.site/graphql';
          const query = `
            query GetPosts {
              Post {
                id
                slug
                date_updated
              }
            }
          `.replace(/\s+/g, ' ').trim();

          try {
            const response = await fetch(GRAPHQL_ENDPOINT, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query })
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.errors) {
              throw new Error(result.errors[0].message || 'GraphQL error');
            }

            const posts = result.data.Post || [];
            return posts.map(post => ({
              loc: `/blog/${post.slug.replace(/\s+/g, '-')}`, // Sử dụng "loc" thay vì "url"
              lastmod: post.date_updated || new Date(),
              changefreq: 'weekly',
              priority: 0.8
            }));
          } catch (error) {
            console.error('Error fetching posts for sitemap:', error);
            return [];
          }
        }
      }
    ]
  },

  apollo: {
    autoImports: true,
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
  gtag: {
    id: 'G-24BGH0YH7H',
  }
});