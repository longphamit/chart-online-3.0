<script setup>
import { ref, computed } from 'vue'
import { useAsyncData, useRouter } from 'nuxt/app'

// State cho phân trang và lọc
const currentPage = ref(1)
const postsPerPage = 6
const selectedCategory = ref('Tất cả')
const categories = ref(['Tất cả', 'Toán học', 'Khảo sát', 'Xã hội', 'Công nghệ'])

// State cho việc tải dữ liệu
const loading = ref(false)
const error = ref(null)

// Base URL cho ảnh từ Directus
const DIRECTUS_ASSETS_URL = 'http://directus.longpc.site/assets'

// GraphQL endpoint
const GRAPHQL_ENDPOINT = 'https://directus.longpc.site/graphql'

// Fetch dữ liệu trên server-side với useAsyncData
const { data: posts, pending, error: fetchError } = await useAsyncData('posts', async () => {
  loading.value = true
  error.value = null

  const query = `
    query GetPosts {
      Post {
        id
        status
        title
        description
        tags
        categoryId
        slug
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
        // Nếu cần token, thêm vào đây:
        // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
      },
      body: JSON.stringify({ query })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.errors) {
      throw new Error(result.errors[0].message || 'GraphQL error occurred')
    }

    if (!result.data || !result.data.Post) {
      throw new Error('No data returned from server')
    }

    return result.data.Post
  } catch (err) {
    error.value = err.message
    console.error('Error fetching posts:', err)
    return []
  } finally {
    loading.value = false
  }
})

// Xử lý dữ liệu bài viết
const blogPosts = computed(() => {
  if (!posts.value || !posts.value.length) return []
  return posts.value.map(post => ({
    id: post.id,
    slug: post.slug.replace(/\s+/g, '-'),
    title: post.title,
    excerpt: post.description,
    image: post.thumbnail?.id
      ? `${DIRECTUS_ASSETS_URL}/${post.thumbnail.id}`
      : 'https://via.placeholder.com/400x200.png?text=' + encodeURIComponent(post.title),
    category: mapCategory(post.categoryId),
    tags: post.tags || [],
    status: post.status
  }))
})

// Lọc bài viết theo danh mục và trạng thái
const filteredPosts = computed(() => {
  let filtered = blogPosts.value.filter(post => post.status === 'published')
  if (selectedCategory.value !== 'Tất cả') {
    filtered = filtered.filter(post => post.category === selectedCategory.value)
  }
  return filtered
})

// Phân trang
const totalPages = computed(() => Math.ceil(filteredPosts.value.length / postsPerPage))
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return filteredPosts.value.slice(start, end)
})

// Map categoryId sang tên danh mục
const mapCategory = (categoryId) => {
  if (!categoryId) return 'Khác'
  const categoryMap = {
    '1': 'Toán học',
    '2': 'Khảo sát',
    '3': 'Xã hội',
    '4': 'Công nghệ'
  }
  return categoryMap[categoryId] || 'Khác'
}

// Phương thức điều hướng trang
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Chọn danh mục
const selectCategory = (category) => {
  selectedCategory.value = category
  currentPage.value = 1
}

// Hàm điều hướng khi click bài viết
const router = useRouter()
const goToPost = (slug) => {
  router.push(`/blog/${slug}`)
}

// SEO metadata
definePageMeta({
  title: 'Chart Online Blog',
  meta: [
    {
      name: 'description',
      content: 'Khám phá các bài viết về trực quan hóa dữ liệu qua các lĩnh vực: Toán học, Khảo sát, Xã hội và Công nghệ.'
    }
  ]
})
</script>

<template>
  <div class="blog-page min-h-screen py-8 px-4 md:px-8">
    <!-- Header -->
    <header class="mb-12 text-center">
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
        Chart Online Blog
      </h1>
      <p class="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
        Khám phá các bài viết về trực quan hóa dữ liệu qua các lĩnh vực: Toán học, Khảo sát, Xã hội và Công nghệ.
      </p>
    </header>

    <!-- Main Layout -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Blog Posts -->
      <section class="lg:col-span-3">
        <div v-if="loading || pending" class="text-center py-8">Đang tải bài viết...</div>
        <div v-else-if="error || fetchError" class="text-center py-8 text-red-500">
          Lỗi: {{ error || fetchError }}
        </div>
        <div v-else>
          <!-- Blog Posts Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            <article
              v-for="post in paginatedPosts"
              :key="post.id"
              class="blog-post bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
              @click="goToPost(post.slug)"
            >
              <img :src="post.image" :alt="post.title" class="w-full h-48 object-cover" />
              <div class="p-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{{ post.title }}</h2>
                <p class="text-gray-600 mb-4 line-clamp-3">{{ post.excerpt }}</p>
                <span class="inline-block text-blue-600 font-medium hover:underline">
                  Đọc thêm →
                </span>
              </div>
            </article>
          </div>

          <!-- Pagination -->
          <div class="mt-12 flex justify-center items-center gap-4">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Trước
            </button>
            <span class="text-gray-700">
              Trang {{ currentPage }} / {{ totalPages }}
            </span>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Sau
            </button>
          </div>
        </div>
      </section>

      <!-- Sidebar (Categories) -->
      <aside class="lg:col-span-1">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Danh Mục</h3>
          <ul class="space-y-2">
            <li v-for="category in categories" :key="category">
              <button
                @click="selectCategory(category)"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                {{ category }}
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>

    <!-- Call to Action -->
    <div class="mt-12 text-center">
      <p class="text-gray-500">
        Bạn muốn đóng góp bài viết? Liên hệ qua <a href="mailto:devmonit99@gmail.com" class="text-blue-600 hover:underline">email</a>!
      </p>
    </div>
  </div>
</template>

<style scoped>
.blog-page {
  font-family: 'Roboto', sans-serif;
}

.blog-post {
  display: flex;
  flex-direction: column;
}

.blog-post img {
  transition: transform 0.3s ease-in-out;
}

.blog-post:hover img {
  transform: scale(1.05);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>