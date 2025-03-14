<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
    <div class="max-w-6xl w-full">
      <!-- Tiêu đề -->
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-10">
        Vẽ Biểu Đồ Tròn Online - Công Cụ Miễn Phí
      </h1>
      <!-- Đoạn mô tả giới thiệu -->
      <p class="text-gray-600 text-center mb-6">
        Công cụ vẽ biểu đồ tròn online miễn phí giúp bạn trực quan hóa dữ liệu phân bổ tỷ lệ. Nhập nhãn và giá trị, tùy chỉnh và tải xuống biểu đồ dễ dàng trên mọi thiết bị!
      </p>

      <!-- Container chính -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Khu vực tùy chỉnh -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span class="text-blue-500">⚙️</span> Tùy Chỉnh Dữ Liệu
            </h3>

            <!-- Tên biểu đồ -->
            <UFormGroup label="Tên biểu đồ">
              <UTextarea v-model="chartName" placeholder="Nhập tên biểu đồ..." />
            </UFormGroup>

            <!-- Nhãn dữ liệu -->
            <UFormGroup label="Nhãn dữ liệu (cách nhau bởi dấu phẩy)">
              <UTextarea v-model="labels" placeholder="Hà Nội, TP.HCM, Đà Nẵng..." />
            </UFormGroup>

            <!-- Giá trị -->
            <UFormGroup label="Giá trị (cách nhau bởi dấu phẩy)">
              <UTextarea v-model="values" placeholder="60, 25.7, 14.3..." />
            </UFormGroup>

            <!-- Nút tải xuống -->
            <UButton
              label="Tải Xuống Biểu Đồ"
              icon="i-heroicons-arrow-down-tray"
              size="md"
              class="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm"
              @click="downloadChart"
            />
          </div>
        </div>

        <!-- Khu vực hiển thị biểu đồ -->
        <div class="lg:col-span-2 bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
          <div ref="chartDiv" class="w-full chart-container"></div>
          <!-- Nội dung bổ sung cho SEO -->
          <div class="mt-6 p-4 bg-gray-100 rounded-lg">
            <h4 class="text-md font-medium mb-2">Biểu đồ tròn là gì?</h4>
            <p class="text-sm text-gray-600">
              Biểu đồ tròn (pie chart) là một loại biểu đồ hình tròn dùng để thể hiện tỷ lệ phần trăm hoặc phân bổ dữ liệu giữa các danh mục. Đây là công cụ trực quan phổ biến trong thống kê và báo cáo.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

// Tối ưu SEO với useHead của Nuxt 3
useHead({
  title: 'Vẽ Biểu Đồ Tròn Online - Công Cụ Miễn Phí',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'description',
      content: 'Công cụ vẽ biểu đồ tròn online miễn phí, dễ sử dụng để trực quan hóa tỷ lệ dữ liệu. Nhập nhãn và giá trị, tải xuống biểu đồ nhanh chóng trên mọi thiết bị.'
    },
    {
      name: 'keywords',
      content: 'vẽ biểu đồ tròn, biểu đồ tròn online, công cụ vẽ biểu đồ, pie chart online, trực quan hóa dữ liệu'
    },
    { name: 'robots', content: 'index, follow' },
    // Open Graph Meta Tags
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Vẽ Biểu Đồ Tròn Online - Công Cụ Miễn Phí' },
    { property: 'og:description', content: 'Công cụ vẽ biểu đồ tròn online miễn phí, trực quan hóa dữ liệu dễ dàng.' },
    { property: 'og:url', content: 'https://vebieudo.online/pie' },
    { property: 'og:image', content: 'https://vebieudo.online/chart-preview.png' }, // Cập nhật ảnh thực tế
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:locale', content: 'vi_VN' },

    // Twitter Card Meta Tags (Hỗ trợ Twitter khi chia sẻ link)
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Vẽ Biểu Đồ Tròn Online - Công Cụ Miễn Phí' },
    { name: 'twitter:description', content: 'Công cụ vẽ biểu đồ tròn online miễn phí, trực quan hóa dữ liệu dễ dàng.' },
    { name: 'twitter:image', content: 'https://vebieudo.online/chart-preview.png' }
    
  ],
  link: [
    { rel: 'canonical', href: 'https://vebieudo.online/pie' } // Thay bằng URL thực tế
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Vẽ Biểu Đồ Tròn Online - Công Cụ Miễn Phí",
        "description": "Công cụ vẽ biểu đồ tròn online miễn phí giúp trực quan hóa dữ liệu dễ dàng.",
        "url": "https://vebieudo.online/pie",
        "image": "https://vebieudo.online/chart-preview.png",
        "publisher": {
          "@type": "Organization",
          "name": "Vẽ Biểu Đồ Online",
          "logo": {
            "@type": "ImageObject",
            "url": "https://vebieudo.online/static/logo.png"
          }
        },
        "mainEntity": {
          "@type": "HowTo",
          "name": "Cách tạo biểu đồ tròn",
          "step": [
            {
              "@type": "HowToStep",
              "name": "Nhập dữ liệu",
              "text": "Điền nhãn và giá trị vào các ô tương ứng."
            },
            {
              "@type": "HowToStep",
              "name": "Tùy chỉnh biểu đồ",
              "text": "Chỉnh sửa tiêu đề và màu sắc để phù hợp với nhu cầu."
            },
            {
              "@type": "HowToStep",
              "name": "Tải xuống",
              "text": "Nhấn nút 'Tải Xuống Biểu Đồ' để lưu biểu đồ về máy."
            }
          ]
        }
      })
    }
  ]
})

// Khai báo dữ liệu
const chartName = ref('Dân số Việt Nam 2020')
const labels = ref('Hà Nội, TP.HCM, Đà Nẵng')
const values = ref('60, 25.7, 14.3')
const chartDiv = ref(null)
let Plotly = null

// Hàm vẽ biểu đồ
const renderChart = () => {
  if (!Plotly || !chartDiv.value) return

  const data = [{
    type: 'pie',
    labels: labels.value.split(',').map(label => label.trim()),
    values: values.value.split(',').map(val => parseFloat(val.trim())),
    textinfo: 'label+percent',
    hoverinfo: 'label+value+percent',
    marker: {
      colors: ['#60a5fa', '#f4d03f', '#6ee7b7']
    }
  }]

  const layout = {
    title: { text: chartName.value, x: 0.5, xanchor: 'center' },
    automargin: true,
    margin: { t: 60, b: 60, l: 50, r: 20 },
    showlegend: true,
    responsive: true, // Đảm bảo responsive
    autosize: true
  }

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d']
  }

  Plotly.newPlot(chartDiv.value, data, layout, config)
}

// Xử lý resize
const handleResize = () => {
  if (Plotly && chartDiv.value) {
    Plotly.Plots.resize(chartDiv.value)
  }
}

// Load Plotly
onMounted(async () => {
  if (process.client) {
    Plotly = await import('plotly.js-dist')
    renderChart()
    window.addEventListener('resize', handleResize)
  }
})

// Dọn dẹp
onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', handleResize)
  }
})

// Tải xuống biểu đồ
const downloadChart = () => {
  if (Plotly && chartDiv.value) {
    Plotly.downloadImage(chartDiv.value, {
      format: 'png',
      filename: 'bieu-do-tron',
      width: 1000,
      height: 600
    })
  }
}

// Theo dõi thay đổi dữ liệu
watch([chartName, labels, values], () => {
  if (process.client && Plotly) {
    renderChart()
  }
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px; /* Chiều cao mặc định cho mobile */
}

@media (min-width: 640px) {
  .chart-container {
    height: 450px; /* Chiều cao cho màn hình lớn */
  }
}

@media (max-width: 639px) {
  .chart-container {
    height: 50vh; /* Chiều cao linh hoạt cho mobile */
  }
}

.min-h-screen {
  background-color: #f9fafb;
}
</style>