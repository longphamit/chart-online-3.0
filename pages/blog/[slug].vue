<template>
  <div class="blog-detail min-h-screen py-8 px-2 md:px-4 max-w-5xl mx-auto">
    <!-- Header -->
    <header class="mb-8 animate-fade-in">
      <NuxtLink to="/blogs" class="inline-flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 hover:text-blue-800 transition-all duration-300 mb-4 shadow-sm">
        <span class="mr-2 text-lg">←</span>
      </NuxtLink>
      <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
        {{ post?.title || 'Đang tải...' }}
      </h1>
      <div class="flex flex-wrap gap-2 mb-4">
        <span v-for="tag in post?.tags || []" :key="tag" class="inline-block px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200">
          #{{ tag }}
        </span>
      </div>
      <img :src="postImage" :alt="`Hình ảnh minh họa cho ${post?.title || 'bài viết'}`" class="w-full h-64 md:h-80 object-cover rounded-lg mb-6 shadow-md transition-transform duration-300 hover:scale-[1.02]" loading="lazy" />
    </header>

    <!-- Content -->
    <section class="prose prose-lg text-gray-700 mb-12">
      <div v-html="post?.content || '<p>Đang tải nội dung...</p>'" class="leading-relaxed"></div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '#app'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = ref(route.params.slug || '')

// State cho việc tải dữ liệu
const loading = ref(false)
const error = ref(null)
const postData = ref(null)

// GraphQL endpoint
const GRAPHQL_ENDPOINT = 'https://directus.longpc.site/graphql'

// Hàm fetch dữ liệu
const fetchPost = async (postSlug) => {
  if (!postSlug) return
  console.log('Fetching post with slug:', postSlug)
  loading.value = true
  error.value = null

  const query = `
    query GetPost($slug: String!) {
      Post(filter: { slug: { _eq: $slug } }) {
        id
        description
        title
        content
        slug
        partnerId
        categoryId
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { slug: postSlug }
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    } else {
      const result = await response.json()
      handleResponse(result)
    }
  } catch (err) {
    error.value = err
    console.error('Error fetching post:', err)
    postData.value = {
      title: 'Không tìm thấy bài viết',
      content: '<p>Bài viết bạn đang tìm không tồn tại. Vui lòng kiểm tra lại đường dẫn.</p>',
      categoryId: null,
      tags: [],
      thumbnail: null,
    }
  } finally {
    loading.value = false
  }
}

// Xử lý response từ API
const handleResponse = (result) => {
  if (result.errors) {
    throw new Error(result.errors[0].message || 'GraphQL error occurred')
  }
  if (!result.data || !result.data.Post || result.data.Post.length === 0) {
    postData.value = {
      title: 'Không tìm thấy bài viết',
      content: '<p>Bài viết bạn đang tìm không tồn tại. Vui lòng kiểm tra lại đường dẫn.</p>',
      categoryId: null,
      tags: [],
      thumbnail: null,
    }
  } else {
    postData.value = result.data.Post[0]
    console.log('Post data:', postData.value)
  }
}

// Gọi API khi component được mount và khi slug thay đổi
onMounted(() => {
  fetchPost(slug.value)
})

watch(
  () => route.params.slug,
  (newSlug) => {
    if (newSlug && newSlug !== slug.value) {
      slug.value = newSlug
      fetchPost(newSlug)
    }
  }
)

const post = computed(() => postData.value || null)

const postImage = computed(() => {
  if (!post.value?.thumbnail?.id) {
    return `https://via.placeholder.com/400x200.png?text=${encodeURIComponent(post.value?.title || 'Not Found')}`
  }
  return `http://directus.longpc.site/assets/${post.value.thumbnail.id}`
})

const mapCategory = (categoryId) => {
  const categoryMap = {
    '1': 'Toán học',
    '2': 'Khảo sát',
    '3': 'Xã hội',
    '4': 'Công nghệ'
  }
  return categoryMap[categoryId] || 'Khác'
}

// Tối ưu SEO và Open Graph/Twitter Cards
useHead({
  title: computed(() => post.value?.title || 'Đang tải...'),
  meta: [
    // SEO cơ bản
    { name: 'description', content: computed(() => post.value?.description || 'Bài viết không có mô tả.') },
    { name: 'keywords', content: computed(() => post.value?.tags?.join(', ') || 'blog, bài viết') },

    // Open Graph
    { property: 'og:title', content: computed(() => post.value?.title || 'Đang tải...') },
    { property: 'og:description', content: computed(() => post.value?.description || 'Bài viết không có mô tả.') },
    { property: 'og:image', content: postImage },
    { property: 'og:url', content: computed(() => `https://tomchart.com/blogs/${slug.value}`) },
    { property: 'og:type', content: 'article' },

    // Twitter Cards
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: computed(() => post.value?.title || 'Đang tải...') },
    { name: 'twitter:description', content: computed(() => post.value?.description || 'Bài viết không có mô tả.') },
    { name: 'twitter:image', content: postImage },
  ],
  link: [
    { rel: 'canonical', href: computed(() => `https://tomchart.com/blogs/${slug.value}`) }
  ]
})
</script>

<style scoped>
.blog-detail { font-family: 'Roboto', sans-serif; }
.prose { max-width: none; }
.prose h2 { margin-top: 2rem; margin-bottom: 1rem; font-size: 1.5rem; color: #1f2937; }
.prose p { margin-bottom: 1.5rem; }
.prose code { background-color: #f3f4f6; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: 'Fira Code', monospace; }
</style>