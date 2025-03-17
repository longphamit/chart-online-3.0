<template>
  <div class="blog-detail min-h-screen py-8 px-2 md:px-4 max-w-5xl mx-auto">
    <!-- Header -->
    <header class="mb-8 animate-fade-in">
      <NuxtLink to="/blogs" class="inline-flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 hover:text-blue-800 transition-all duration-300 mb-4 shadow-sm">
        <span class="mr-2 text-lg">←</span>
      </NuxtLink>
      <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
        {{ post?.title || 'Không tìm thấy bài viết' }}
      </h1>
      <div class="flex flex-wrap gap-2 mb-4">
        <span v-for="tag in post?.tags || []" :key="tag" class="inline-block px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200">
          #{{ tag }}
        </span>
      </div>
      <img :src="postImage" :alt="`Hình ảnh minh họa cho ${post?.title || 'bài viết'}`" class="w-full h-64 md:h-80 object-cover rounded-lg mb-6 shadow-md transition-transform duration-300 hover:scale-[1.02]" loading="lazy" />
    </header>

    <!-- Nội dung bài viết -->
    <section class="prose prose-lg text-gray-700 mb-12">
      <div v-html="post?.content || '<p>Không có nội dung.</p>'" class="leading-relaxed"></div>
    </section>
  </div>
</template>

<script setup>
import { useRoute, useAsyncData } from 'nuxt/app'
import { computed } from 'vue'
import { useHead } from '#app'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = route.params.slug

// Fetch dữ liệu từ API GraphQL trước khi trang render
const { data: postData, error } = await useAsyncData(`post-${slug}`, async () => {
  const GRAPHQL_ENDPOINT = 'https://directus.longpc.site/graphql'
  const query = `
    query GetPost($slug: String!) {
      Post(filter: { slug: { _eq: $slug } }) {
        id
        description
        title
        content
        slug
        tags
        thumbnail {
          id
        }
      }
    }
  `.replace(/\s+/g, ' ').trim()

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { slug } })
    })

    if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`)
    
    const result = await response.json()
    if (!result.data || !result.data.Post || result.data.Post.length === 0) {
      throw new Error('Bài viết không tồn tại')
    }

    return result.data.Post[0]
  } catch (err) {
    console.error('Lỗi khi lấy bài viết:', err)
    return {
      title: 'Không tìm thấy bài viết',
      content: '<p>Bài viết bạn đang tìm không tồn tại hoặc đã bị xóa.</p>',
      tags: [],
      thumbnail: null,
    }
  }
})

// Xử lý ảnh đại diện bài viết
const postImage = computed(() => {
  if (!postData.value?.thumbnail?.id) {
    return `https://via.placeholder.com/400x200.png?text=${encodeURIComponent(postData.value?.title || 'Not Found')}`
  }
  return `http://directus.longpc.site/assets/${postData.value.thumbnail.id}`
})

// Tối ưu SEO và Open Graph/Twitter Cards
useHead({
  title: computed(() => postData.value?.title || 'Không tìm thấy bài viết'),
  meta: [
    { name: 'description', content: computed(() => postData.value?.description || 'Bài viết không có mô tả.') },
    { property: 'og:title', content: computed(() => postData.value?.title || 'Không tìm thấy bài viết') },
    { property: 'og:description', content: computed(() => postData.value?.description || 'Bài viết không có mô tả.') },
    { property: 'og:image', content: postImage },
    { property: 'og:url', content: computed(() => `https://tomchart.com/blog/${slug}`) },
    { property: 'og:type', content: 'article' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: computed(() => postData.value?.title || 'Không tìm thấy bài viết') },
    { name: 'twitter:description', content: computed(() => postData.value?.description || 'Bài viết không có mô tả.') },
    { name: 'twitter:image', content: postImage },
  ],
  link: [{ rel: 'canonical', href: computed(() => `https://tomchart.com/blog/${slug}`) }]
})

const post = computed(() => postData.value)
</script>

<style scoped>
.blog-detail { font-family: 'Roboto', sans-serif; }
.prose { max-width: none; }
.prose h2 { margin-top: 2rem; margin-bottom: 1rem; font-size: 1.5rem; color: #1f2937; }
.prose p { margin-bottom: 1.5rem; }
.prose code { background-color: #f3f4f6; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: 'Fira Code', monospace; }
</style>
