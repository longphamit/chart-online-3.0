<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
    <div class="max-w-6xl w-full">
      <!-- Tiêu đề -->
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-10">
        Vẽ Đồ Thị Hàm Số Bậc 3 Online - Công Cụ Miễn Phí
      </h1>
      <!-- Đoạn mô tả giới thiệu -->
      <p class="text-gray-600 text-center mb-6">
        Công cụ vẽ đồ thị hàm số bậc 3 online miễn phí giúp bạn trực quan hóa phương trình \( y = ax^3 + bx^2 + cx + d \). Nhập hệ số, tùy chỉnh và tải xuống đồ thị dễ dàng trên mọi thiết bị!
      </p>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Form nhập dữ liệu -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span class="text-blue-500">⚙️</span> Tùy Chỉnh Dữ Liệu
            </h3>

            <UFormGroup label="Tên biểu đồ">
              <UTextarea v-model="chartName" placeholder="Nhập tên biểu đồ..." class="w-full" />
            </UFormGroup>

            <div class="grid grid-cols-2 gap-4">
              <UFormGroup label="Hệ số a (x³)">
                <UInput v-model="a" placeholder="Nhập a..." class="w-full" />
              </UFormGroup>
              <UFormGroup label="Hệ số b (x²)">
                <UInput v-model="b" placeholder="Nhập b..." class="w-full" />
              </UFormGroup>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <UFormGroup label="Hệ số c (x)">
                <UInput v-model="c" placeholder="Nhập c..." class="w-full" />
              </UFormGroup>
              <UFormGroup label="Hằng số d">
                <UInput v-model="d" placeholder="Nhập d..." class="w-full" />
              </UFormGroup>
            </div>

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

        <!-- Khu vực vẽ biểu đồ -->
        <div class="lg:col-span-2 bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
          <div ref="chartDiv" class="w-full chart-container"></div>
          <div class="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 class="text-lg font-semibold mb-2">Phân Tích Dữ Liệu</h3>
            <p>Min: {{ min }}</p>
            <p>Max: {{ max }}</p>
            <div class="mt-4 text-sm text-gray-600">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-blue-600 font-bold">◆</span>
                <span class="font-medium">Công thức hàm số:</span>
              </div>
              <div class="bg-white p-4 rounded-md border border-gray-200">
                <span ref="formulaRef" class="katex-formula text-lg leading-relaxed"></span>
              </div>
            </div>
            <!-- Nội dung bổ sung cho SEO -->
            <div class="mt-4">
              <h4 class="text-md font-medium mb-2">Hàm số bậc 3 là gì?</h4>
              <p class="text-sm text-gray-600">
                Hàm số bậc 3 có dạng \( y = ax^3 + bx^2 + cx + d \), là một hàm đa thức với bậc cao nhất là 3. Đồ thị của nó thường có hình dạng cong đặc trưng, được sử dụng trong toán học và vật lý để mô phỏng các hiện tượng phức tạp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'

// Tối ưu SEO với useHead của Nuxt 3
useHead({
  title: 'Vẽ Đồ Thị Hàm Số Bậc 3 Online - Công Cụ Miễn Phí',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'description',
      content: 'Công cụ vẽ đồ thị hàm số bậc 3 online miễn phí, hỗ trợ trực quan hóa phương trình y = ax³ + bx² + cx + d. Nhập hệ số và tải xuống đồ thị nhanh chóng trên mọi thiết bị.'
    },
    {
      name: 'keywords',
      content: 'vẽ đồ thị hàm số bậc 3, hàm số bậc 3 online, công cụ vẽ hàm số, cubic function graph, trực quan hóa dữ liệu'
    },
    { name: 'robots', content: 'index, follow' }
  ],
  link: [
    { rel: 'canonical', href: 'https://yourdomain.com/do-thi-ham-so-bac-3' } // Thay bằng URL thực tế
  ]
})

const chartName = ref('Đồ Thị Hàm Số Bậc 3')
const a = ref('1')
const b = ref('0')
const c = ref('0')
const d = ref('0')
const showGrid = ref(true)
const chartDiv = ref(null)
const formulaRef = ref(null)
let Plotly = null

const min = ref(0)
const max = ref(0)

// Hàm tính giá trị y dựa trên phương trình bậc 3
const calculateCubicFunction = (x, a, b, c, d) => {
  const aValue = parseFloat(a) || 0
  const bValue = parseFloat(b) || 0
  const cValue = parseFloat(c) || 0
  const dValue = parseFloat(d) || 0
  return aValue * x * x * x + bValue * x * x + cValue * x + dValue
}

// Công thức hiển thị bằng KaTeX
const functionFormula = computed(() => {
  return `y = ${parseFloat(a.value) || 0}x^3 + ${parseFloat(b.value) || 0}x^2 + ${parseFloat(c.value) || 0}x + ${parseFloat(d.value) || 0}`
})

const renderChart = () => {
  if (!Plotly || !chartDiv.value) return

  const functionX = []
  const functionY = []
  for (let x = -10; x <= 10; x += 0.2) {
    functionX.push(x)
    functionY.push(calculateCubicFunction(x, a.value, b.value, c.value, d.value))
  }

  min.value = Math.min(...functionY)
  max.value = Math.max(...functionY)

  Plotly.newPlot(chartDiv.value, [
    {
      type: 'scatter',
      mode: 'lines',
      x: functionX,
      y: functionY,
      line: { color: '#ff4500', width: 2 },
      name: 'Đường hàm số bậc 3'
    }
  ], {
    title: { text: chartName.value, x: 0.5, xanchor: 'center' },
    xaxis: { showgrid: showGrid.value },
    yaxis: { showgrid: showGrid.value },
    margin: { t: 60, b: 60, l: 50, r: 20 },
    responsive: true,
    autosize: true
  }, {
    responsive: true
  })

  const { $katex } = useNuxtApp()
  if ($katex && formulaRef.value) {
    $katex.render(functionFormula.value, formulaRef.value, { displayMode: true, throwOnError: false })
  }
}

const downloadChart = () => {
  if (Plotly && chartDiv.value) {
    Plotly.downloadImage(chartDiv.value, {
      format: 'png',
      filename: 'do-thi-ham-so-bac-3',
      width: 1000,
      height: 600
    })
  }
}

onMounted(async () => {
  if (process.client) {
    Plotly = await import('plotly.js-dist')
    renderChart()
  }
})

watch([chartName, a, b, c, d, showGrid], renderChart)
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px; /* Chiều cao mặc định cho mobile */
}

@media (min-width: 640px) {
  .chart-container {
    height: 450px; /* Chiều cao lớn hơn cho màn hình lớn */
  }
}

@media (max-width: 639px) {
  .chart-container {
    height: 50vh; /* Chiều cao linh hoạt dựa trên viewport cho mobile */
  }
}

.katex-formula {
  display: block;
  text-align: center;
}
</style>