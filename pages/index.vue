<template>
  <div class="max-w-2xl mx-auto text-center py-12 sm:py-20 px-4">
    <!-- Icon chào mừng -->
    <div class="flex justify-center mb-4">
      <svg 
        class="w-12 h-12 sm:w-16 sm:h-16 text-blue-500" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path class="chart-line" d="M3 18L9 12L15 18L21 6" />
      </svg>
    </div>

    <!-- Tiêu đề chính -->
    <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
      Chào mừng đến với Chart Online!
    </h1>

    <!-- Mô tả ngắn -->
    <p class="text-gray-600 mb-6">
      Công cụ vẽ biểu đồ trực tuyến miễn phí, giúp bạn trực quan hóa dữ liệu dễ dàng với các loại biểu đồ như cột, đường, tròn, parabol, box plot và hàm số bậc 3.
    </p>

    <!-- Nút chính -->
    <NuxtLink 
      to="/bar" 
      class="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200 mb-8"
    >
      <span class="mr-2">📊</span>
      <span>Bắt đầu vẽ biểu đồ của bạn</span>
    </NuxtLink>

    <!-- Tiêu đề phụ -->
    <h2 class="text-xl sm:text-2xl font-semibold text-gray-700 mb-6">
      Khám phá các loại biểu đồ
    </h2>

    <!-- Các nút điều hướng tới từng trang -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
      <NuxtLink 
        v-for="(item, index) in chartTypes" 
        :key="index" 
        :to="item.path" 
        class="flex items-center justify-center px-4 py-3 bg-white text-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
      >
        <span class="mr-2">{{ item.icon }}</span>
        <span>{{ item.name }}</span>
      </NuxtLink>
    </div>

    <!-- Thông tin liên hệ -->
    <section class="mt-12 text-gray-600 text-sm">
      <h3 class="text-lg font-semibold text-gray-700 mb-2">Liên hệ với chúng tôi</h3>
      <p>
        Được tạo bởi <span class="font-semibold">LongPC</span><br>
        Email: <a href="mailto:devmonit99@gmail.com" class="text-blue-600 hover:underline">devmonit99@gmail.com</a>
      </p>
    </section>
  </div>
</template>

<script setup>
// Tối ưu SEO với useHead của Nuxt 3
useHead({
  title: 'Chart Online - Công Cụ Vẽ Biểu Đồ Online Miễn Phí',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'description',
      content: 'Chart Online - Công cụ vẽ biểu đồ online miễn phí. Tạo biểu đồ cột, đường, tròn, parabol, box plot và hàm số bậc 3 nhanh chóng, dễ dàng trên mọi thiết bị.'
    },
    {
      name: 'keywords',
      content: 'vẽ biểu đồ online, công cụ vẽ biểu đồ, biểu đồ cột online, biểu đồ đường online, biểu đồ tròn online, parabol online, box plot online, hàm số bậc 3 online'
    },
    { name: 'robots', content: 'index, follow' },
    { name: 'author', content: 'LongPC, devmonit99@gmail.com' }
  ],
  link: [
    { rel: 'canonical', href: 'https://tomchart.com' } // Thay bằng domain thực tế
  ]
})

// Danh sách các loại biểu đồ với đường dẫn
const chartTypes = [
  { path: '/bar', name: 'Biểu đồ Cột', icon: '📊' },
  { path: '/line', name: 'Biểu đồ Đường', icon: '📈' },
  { path: '/pie', name: 'Biểu đồ Tròn', icon: '🥧' },
  { path: '/scatter', name: 'Scatter Plot', icon: '🔴' },
  { path: '/parabol', name: 'Parabol', icon: '📐' },
  { path: '/boxplot', name: 'Box Plot', icon: '📦' },
  { path: '/cubic', name: 'Hàm số bậc 3', icon: '〽️' },
]
</script>

<style scoped>
/* Đảm bảo responsive cho các nút điều hướng */
.grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Hiệu ứng vẽ đường cho SVG */
.chart-line {
  stroke-dasharray: 50; /* Tổng chiều dài đường vẽ */
  stroke-dashoffset: 50; /* Ẩn toàn bộ đường vẽ ban đầu */
  animation: draw 2s ease-in-out infinite; /* Lặp lại hiệu ứng vẽ */
}

@keyframes draw {
  to {
    stroke-dashoffset: 0; /* Hiển thị toàn bộ đường vẽ */
  }
}
</style>