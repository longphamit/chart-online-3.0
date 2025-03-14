<template>
  <div class="flex min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
    <!-- Sidebar -->
    <aside 
      class="fixed top-0 left-0 z-50 w-72 bg-gradient-to-b from-gray-50 to-blue-100 text-gray-800 flex flex-col p-6 shadow-lg min-h-screen transition-all duration-300 ease-in-out md:static md:translate-x-0 backdrop-blur-md font-roboto"
      :class="{ '-translate-x-full': !isSidebarOpen }"
    >
      <!-- Logo/Title -->
      <div class="flex items-center justify-between gap-3 mb-10">
        <div class="flex items-center gap-3">
          <img src="/logo.png" alt="Chart Online Logo" class="w-20 h-20 " />
          <h1 class="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            Chart Online
          </h1>
        </div>
        <!-- Close button for mobile -->
        <button 
          @click="toggleSidebar" 
          class="md:hidden p-2 rounded-full bg-gray-200/50 text-gray-600 hover:text-gray-800 hover:bg-gray-300 transition-all" 
          aria-label="Đóng sidebar"
        >
          <span class="text-xl">✕</span>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex flex-col gap-2">
        <NuxtLink 
          v-for="(item, index) in navItems" 
          :key="index"
          :to="item.path" 
          class="group relative flex items-center gap-4 py-3 px-5 rounded-2xl text-gray-700 hover:text-gray-900 no-underline transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-md text-base"
          active-class="bg-gradient-to-r from-cyan-200/50 to-blue-200/50 text-gray-900 shadow-sm no-underline"
          @click="closeSidebar"
        >
          <span class="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-300/30 to-blue-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span class="relative w-6 text-center text-xl transition-transform group-hover:scale-110" aria-hidden="true">{{ item.icon }}</span>
          <span class="relative font-medium tracking-wide">{{ item.name }}</span>
        </NuxtLink>
      </nav>

      <!-- Footer -->
      <footer class="mt-auto pt-6 flex flex-col gap-2 text-gray-500 text-sm">
        <p>
          © 2025 <span class="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Chart Online</span>
        </p>
        <p>
          Được tạo bởi <span class="font-semibold">LongPC</span> | Email: <a href="mailto:devmonit99@gmail.com" class="text-blue-600 hover:underline">devmonit99@gmail.com</a>
        </p>
        <p class="text-xs">
          Công cụ trực quan hóa dữ liệu miễn phí, hỗ trợ vẽ biểu đồ cột, đường, tròn, parabol, box plot và hơn thế nữa.
        </p>
      </footer>
    </aside>

    <!-- Overlay for mobile -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 bg-gradient-to-br from-gray-200/50 to-blue-200/50 z-40 md:hidden transition-opacity duration-300" 
      @click="toggleSidebar"
      aria-hidden="true"
    ></div>

    <!-- Main Content -->
    <main class="flex-1 p-4 md:p-8 bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl m-2 md:m-6 transition-all duration-300">
      <!-- Toggle Button for Mobile -->
      <button 
        @click="toggleSidebar" 
        class="fixed top-4 right-4 md:hidden z-50 p-2 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center w-10 h-10"
        aria-label="Mở sidebar"
      >
        <span class="text-xl animate-pulse">☰</span>
      </button>
      
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Tối ưu SEO với useHead của Nuxt 3 (cơ bản cho layout)
useHead({
  title: 'Chart Online - Công Cụ Vẽ Biểu Đồ Miễn Phí',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'description',
      content: 'Chart Online - Công cụ vẽ biểu đồ miễn phí, hỗ trợ biểu đồ cột, đường, tròn, parabol, box plot và hàm số bậc 3. Trực quan hóa dữ liệu dễ dàng trên mọi thiết bị.'
    },
    {
      name: 'keywords',
      content: 'vẽ biểu đồ online, công cụ vẽ biểu đồ, biểu đồ cột, biểu đồ đường, biểu đồ tròn, parabol, box plot, hàm số bậc 3, trực quan hóa dữ liệu'
    },
    { name: 'robots', content: 'index, follow' },
    { name: 'author', content: 'LongPC, devmonit99@gmail.com' },

    // Open Graph Meta Tags
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Vẽ Biểu Đồ Online - Công Cụ Miễn Phí' },
    { property: 'og:description', content: 'Công cụ vẽ biểu đồ online miễn phí, trực quan hóa dữ liệu dễ dàng.' },
    { property: 'og:url', content: 'https://vebieudo.online/pie' },
    { property: 'og:image', content: 'https://vebieudo.online/chart-preview.png' }, // Cập nhật ảnh thực tế
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:locale', content: 'vi_VN' },

    // Twitter Card Meta Tags (Hỗ trợ Twitter khi chia sẻ link)
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Vẽ Biểu Đồ Online - Công Cụ Miễn Phí' },
    { name: 'twitter:description', content: 'Công cụ vẽ biểu đồ online miễn phí, trực quan hóa dữ liệu dễ dàng.' },
    { name: 'twitter:image', content: 'https://vebieudo.online/chart-preview.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://vebieudo.online' } // Thay bằng domain thực tế
  ]
})

// State để điều khiển sidebar trên mobile
const isSidebarOpen = ref(false)

// Danh sách navigation items (thêm Blog)
const navItems = [
  { path: '/', name: 'Trang chủ', icon: '🏠' },
  { path: '/bar', name: 'Biểu đồ Cột', icon: '📊' },
  { path: '/line', name: 'Biểu đồ Đường', icon: '📈' },
  { path: '/pie', name: 'Biểu đồ Tròn', icon: '🥧' },
  { path: '/scatter', name: 'Scatter Plot', icon: '🔴' },
  { path: '/parabol', name: 'Parabol', icon: '📐' },
  { path: '/boxplot', name: 'Box Plot', icon: '📦' },
  { path: '/cubic', name: 'Phương trình bậc 3', icon: '〽️' },
  { path: '/blogs', name: 'Blog', icon: '📝' }, // Thêm mục Blog
]

// Hàm toggle sidebar
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// Đóng sidebar khi click link trên mobile
const closeSidebar = () => {
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false
  }
}
</script>

<style>
/* Tùy chỉnh font chữ cho toàn bộ ứng dụng hoặc chỉ sidebar */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap&subset=vietnamese');

.font-roboto {
  font-family: 'Roboto', sans-serif;
}
</style>
