<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
    <div class="max-w-6xl w-full">
      <!-- Tiêu đề -->
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-10">
        Vẽ Biểu Đồ Đường Online - Công Cụ Miễn Phí
      </h1>
      <!-- Đoạn mô tả giới thiệu -->
      <p class="text-gray-600 text-center mb-6">
        Công cụ vẽ biểu đồ đường online miễn phí giúp bạn trực quan hóa dữ liệu theo thời gian. Nhập nhãn và giá trị, tùy chỉnh và tải xuống biểu đồ dễ dàng trên mọi thiết bị!
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
            <UFormGroup label="Nhãn trục X (cách nhau bởi dấu phẩy)">
              <UTextarea v-model="labels" placeholder="Tháng 1, Tháng 2, Tháng 3..." />
            </UFormGroup>

            <!-- Giá trị -->
            <UFormGroup label="Giá trị (cách nhau bởi dấu phẩy)">
              <UTextarea v-model="values" placeholder="10, 20, 30..." />
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
          <div ref="lineChartDiv" class="w-full chart-container"></div>
          <!-- Nội dung bổ sung cho SEO -->
          <div class="mt-6 p-4 bg-gray-100 rounded-lg">
            <h4 class="text-md font-medium mb-2">Biểu đồ đường là gì?</h4>
            <p class="text-sm text-gray-600">
              Biểu đồ đường (line chart) là một loại biểu đồ dùng để hiển thị xu hướng dữ liệu theo thời gian hoặc các danh mục liên tục. Đây là công cụ hữu ích để phân tích sự thay đổi và dự đoán xu hướng.
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
  title: 'Vẽ Biểu Đồ Đường Online - Công Cụ Miễn Phí',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'description',
      content: 'Công cụ vẽ biểu đồ đường online miễn phí, dễ sử dụng để trực quan hóa xu hướng dữ liệu. Nhập nhãn và giá trị, tải xuống biểu đồ nhanh chóng trên mọi thiết bị.'
    },
    {
      name: 'keywords',
      content: 'vẽ biểu đồ đường, biểu đồ đường online, công cụ vẽ biểu đồ, line chart online, trực quan hóa dữ liệu'
    },
    { name: 'robots', content: 'index, follow' }
  ],
  link: [
    { rel: 'canonical', href: 'https://yourdomain.com/bieu-do-duong' } // Thay bằng URL thực tế
  ]
})

// Khai báo dữ liệu
const chartName = ref('Doanh thu hàng tháng')
const labels = ref('Tháng 1, Tháng 2, Tháng 3')
const values = ref('10, 20, 30')
const lineChartDiv = ref(null)
let Plotly = null

// Hàm vẽ biểu đồ
const renderChart = () => {
  if (!Plotly || !lineChartDiv.value) return

  const xData = labels.value.split(',').map(label => label.trim())
  const yData = values.value.split(',').map(val => parseFloat(val.trim()))

  const lineData = [{
    type: 'scatter',
    mode: 'lines+markers',
    x: xData,
    y: yData,
    line: { color: '#1d4ed8', width: 2 },
    marker: { color: '#f59e0b', size: 8 }
  }]

  const layout = {
    title: { text: chartName.value, x: 0.5, xanchor: 'center' },
    xaxis: { title: 'Thời gian', showgrid: false },
    yaxis: { title: 'Giá trị', zeroline: false },
    margin: { t: 60, b: 60, l: 50, r: 20 },
    responsive: true, // Đảm bảo responsive
    autosize: true
  }

  const config = { 
    responsive: true, 
    displayModeBar: true, 
    displaylogo: false 
  }
  
  Plotly.newPlot(lineChartDiv.value, lineData, layout, config)
}

// Xử lý resize
const handleResize = () => {
  if (Plotly && lineChartDiv.value) {
    Plotly.Plots.resize(lineChartDiv.value)
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
  if (Plotly && lineChartDiv.value) {
    Plotly.downloadImage(lineChartDiv.value, { 
      format: 'png', 
      filename: 'bieu-do-duong', 
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
    height: 400px; /* Chiều cao cho màn hình lớn */
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