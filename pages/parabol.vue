<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
    <div class="max-w-6xl w-full">
      <!-- Tiêu đề -->
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-10">
        Vẽ Biểu Đồ Parabol Online - Công Cụ Miễn Phí
      </h1>
      <!-- Đoạn mô tả giới thiệu -->
      <p class="text-gray-600 text-center mb-6">
        Công cụ vẽ biểu đồ parabol online miễn phí giúp bạn trực quan hóa hàm bậc hai \( y = ax^2 + bx + c \). Nhập tham số, tùy chỉnh và tải xuống biểu đồ dễ dàng trên mọi thiết bị!
      </p>

      <!-- Container chính -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Khu vực tùy chỉnh -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span class="text-blue-500">⚙️</span> Tùy Chỉnh Dữ Liệu
            </h3>

            <UFormGroup label="Tên biểu đồ">
              <UTextarea v-model="chartName" placeholder="Nhập tên biểu đồ..." />
            </UFormGroup>

            <UFormGroup label="Tham số a">
              <UInput v-model="a" placeholder="Nhập a (ví dụ: 1)..." />
            </UFormGroup>

            <UFormGroup label="Tham số b">
              <UInput v-model="b" placeholder="Nhập b (ví dụ: 0)..." />
            </UFormGroup>

            <UFormGroup label="Tham số c">
              <UInput v-model="c" placeholder="Nhập c (ví dụ: 0)..." />
            </UFormGroup>

            <UFormGroup>
              <UCheckbox v-model="showGrid" label="Hiển thị lưới" />
            </UFormGroup>

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
          <div class="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 class="text-lg font-semibold mb-2">Phân Tích Dữ Liệu</h3>
            <div class="mt-4 text-sm text-gray-600">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-blue-600 font-bold">◆</span>
                <span class="font-medium">Công thức đường parabol: \( y = ax^2 + bx + c \)</span>
              </div>
              <div class="bg-white p-4 rounded-md border border-gray-200">
                <span ref="formulaRef" class="katex-formula text-lg leading-relaxed"></span>
              </div>
            </div>
            <!-- Nội dung bổ sung cho SEO -->
            <div class="mt-4">
              <h4 class="text-md font-medium mb-2">Biểu đồ parabol là gì?</h4>
              <p class="text-sm text-gray-600">
                Biểu đồ parabol là hình ảnh trực quan của hàm bậc hai \( y = ax^2 + bx + c \), thường được dùng trong toán học và vật lý để mô tả chuyển động hoặc mối quan hệ phi tuyến tính. Công cụ này giúp bạn vẽ parabol nhanh chóng và chính xác.
              </p>
            </div>
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
  title: 'Vẽ Biểu Đồ Parabol Online - Công Cụ Miễn Phí',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'description',
      content: 'Công cụ vẽ biểu đồ parabol online miễn phí, hỗ trợ trực quan hóa hàm bậc hai y = ax^2 + bx + c. Nhập tham số và tải xuống biểu đồ nhanh chóng trên mọi thiết bị.'
    },
    {
      name: 'keywords',
      content: 'vẽ biểu đồ parabol, biểu đồ parabol online, công cụ vẽ hàm bậc hai, parabola chart, trực quan hóa dữ liệu'
    },
    { name: 'robots', content: 'index, follow' }
  ],
  link: [
    { rel: 'canonical', href: 'https://tomchart.com/parabol' } // Thay bằng URL thực tế
  ]
})

const chartName = ref('Biểu Đồ Parabol')
const a = ref('1')
const b = ref('0')
const c = ref('0')
const showGrid = ref(true)
const chartDiv = ref(null)
const formulaRef = ref(null)
let Plotly = null

const calculateParabola = (x, a, b, c) => {
  return a * x * x + b * x + c
}

const renderChart = () => {
  if (!Plotly || !chartDiv.value) return

  const aValue = parseFloat(a.value) || 0
  const bValue = parseFloat(b.value) || 0
  const cValue = parseFloat(c.value) || 0

  const minX = -10
  const maxX = 10
  const step = (maxX - minX) / 100
  const parabolaX = []
  const parabolaY = []

  for (let x = minX; x <= maxX; x += step) {
    parabolaX.push(x)
    parabolaY.push(calculateParabola(x, aValue, bValue, cValue))
  }

  const parabolaData = {
    type: 'scatter',
    mode: 'lines',
    x: parabolaX,
    y: parabolaY,
    line: { color: '#ff4500', width: 2 },
    name: 'Đường parabol'
  }

  const layout = {
    title: { text: chartName.value, x: 0.5, xanchor: 'center' },
    xaxis: { showgrid: showGrid.value, title: 'Trục X' },
    yaxis: { showgrid: showGrid.value, title: 'Trục Y' },
    margin: { t: 60, b: 60, l: 50, r: 20 },
    responsive: true,
    autosize: true
  }

  Plotly.newPlot(chartDiv.value, [parabolaData], layout, { responsive: true })

  const { $katex } = useNuxtApp()
  if ($katex && formulaRef.value) {
    $katex.render(
      "y = ax^2 + bx + c",
      formulaRef.value,
      { displayMode: true, throwOnError: false }
    )
  }
}

const downloadChart = () => {
  if (Plotly && chartDiv.value) {
    Plotly.downloadImage(chartDiv.value, {
      format: 'png',
      filename: 'bieu-do-parabol',
      width: 1000,
      height: 600
    })
  }
}

onMounted(async () => {
  if (process.client) {
    Plotly = await import('plotly.js-dist')
    renderChart()
    window.addEventListener('resize', renderChart)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', renderChart)
  }
})

watch([chartName, a, b, c, showGrid], renderChart)
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

.katex-formula {
  display: inline-block;
  width: 100%;
}
</style>