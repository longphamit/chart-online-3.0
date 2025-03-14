<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
    <div class="max-w-6xl w-full">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-10">
        Vẽ Biểu Đồ Rời Rạc Online - Công Cụ Miễn Phí
      </h1>
      <p class="text-gray-600 text-center mb-6">
        Sử dụng công cụ vẽ biểu đồ rời rạc online để trực quan hóa dữ liệu, tính hệ số tương quan Pearson, và thêm đường xu hướng dễ dàng. Hoàn toàn miễn phí và responsive trên mọi thiết bị!
      </p>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span class="text-blue-500">⚙️</span> Tùy Chỉnh Dữ Liệu
            </h3>

            <UFormGroup label="Tên biểu đồ">
              <UTextarea v-model="chartName" placeholder="Nhập tên biểu đồ..." />
            </UFormGroup>

            <UFormGroup label="Tên cột X">
              <UInput v-model="xLabel" placeholder="Nhập tên cột X..." />
            </UFormGroup>

            <UFormGroup label="Tên cột Y">
              <UInput v-model="yLabel" placeholder="Nhập tên cột Y..." />
            </UFormGroup>

            <UFormGroup label="Giá trị X (cách nhau bởi dấu phẩy)">
              <UTextarea v-model="xValues" placeholder="1, 2, 3..." />
            </UFormGroup>

            <UFormGroup label="Giá trị Y (cách nhau bởi dấu phẩy)">
              <UTextarea v-model="yValues" placeholder="10, 20, 30..." />
            </UFormGroup>

            <UFormGroup>
              <UCheckbox v-model="showGrid" label="Hiển thị lưới" />
            </UFormGroup>

            <UFormGroup>
              <UCheckbox v-model="showTrendLine" label="Hiển thị đường xu hướng" />
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

        <div class="lg:col-span-2 bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
          <div ref="chartDiv" class="w-full chart-container"></div>
          <div class="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 class="text-lg font-semibold mb-2">Phân Tích Dữ Liệu</h3>
            <p>Min: {{ min }}</p>
            <p>Max: {{ max }}</p>
            <p>Trung bình: {{ mean }}</p>
            <p>Phương sai: {{ variance }}</p>
            <p>Độ lệch chuẩn: {{ stdDev }}</p>
            <p>Hệ số tương quan R: {{ correlation }}</p>
            <div class="mt-4 text-sm text-gray-600">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-blue-600 font-bold">◆</span>
                <span class="font-medium">Công thức tính hệ số tương quan Pearson (R):</span>
              </div>
              <div class="bg-white p-4 rounded-md border border-gray-200">
                <span ref="formulaRef" class="katex-formula text-lg leading-relaxed"></span>
              </div>
              <div class="mt-2 pl-6 text-gray-700">
                <p class="mb-1">Trong đó:</p>
                <ul class="list-disc space-y-1">
                  <li ref="note1Ref">Các giá trị trong dãy số X và Y: <span class="katex-inline"></span></li>
                  <li ref="note2Ref">Giá trị trung bình của X và Y: <span class="katex-inline"></span></li>
                </ul>
              </div>
            </div>
            <div class="mt-4">
              <h4 class="text-md font-medium mb-2">Biểu đồ rời rạc là gì?</h4>
              <p class="text-sm text-gray-600">
                Biểu đồ rời rạc (scatter plot) là một loại biểu đồ dùng để hiển thị mối quan hệ giữa hai biến số, thường được sử dụng trong phân tích dữ liệu và thống kê. Công cụ này giúp bạn vẽ biểu đồ nhanh chóng và phân tích dữ liệu hiệu quả.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

// Tối ưu SEO với useHead của Nuxt 3
useHead({
  title: 'Vẽ Biểu Đồ Rời Rạc Online - Công Cụ Miễn Phí',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'description',
      content: 'Công cụ vẽ biểu đồ rời rạc online miễn phí, hỗ trợ tính hệ số tương quan Pearson, đường xu hướng và phân tích dữ liệu.'
    },
    {
      name: 'keywords',
      content: 'vẽ biểu đồ rời rạc, biểu đồ scatter plot, công cụ vẽ biểu đồ online, tính hệ số tương quan Pearson'
    },
    { name: 'robots', content: 'index, follow' }
  ],
  link: [
    { rel: 'canonical', href: 'https://yourdomain.com/bieu-do-roi-rac' } // Thay bằng URL thực tế
  ]
})

const chartName = ref('Biểu Đồ Rời Rạc')
const xLabel = ref('Trục X')
const yLabel = ref('Trục Y')
const xValues = ref('1, 2, 3')
const yValues = ref('10, 20, 30')
const showGrid = ref(true)
const showTrendLine = ref(false)
const chartDiv = ref(null)
const formulaRef = ref(null)
const note1Ref = ref(null)
const note2Ref = ref(null)
let Plotly = null

const min = ref(0)
const max = ref(0)
const mean = ref(0)
const variance = ref(0)
const stdDev = ref(0)
const correlation = ref(0)

// Hàm tính hồi quy tuyến tính (đường xu hướng)
const calculateLinearRegression = (xData, yData) => {
  const n = xData.length
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0

  for (let i = 0; i < n; i++) {
    sumX += xData[i]
    sumY += yData[i]
    sumXY += xData[i] * yData[i]
    sumX2 += xData[i] * xData[i]
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  return { slope, intercept }
}

const calculateStats = () => {
  const xData = xValues.value.split(',').map(v => parseFloat(v.trim()))
  const yData = yValues.value.split(',').map(v => parseFloat(v.trim()))
  if (xData.length === 0 || yData.length === 0 || xData.length !== yData.length) return

  min.value = Math.min(...yData)
  max.value = Math.max(...yData)
  mean.value = yData.reduce((a, b) => a + b, 0) / yData.length
  variance.value = yData.reduce((sum, val) => sum + Math.pow(val - mean.value, 2), 0) / yData.length
  stdDev.value = Math.sqrt(variance.value)

  const xMean = xData.reduce((a, b) => a + b, 0) / xData.length
  const yMean = yData.reduce((a, b) => a + b, 0) / yData.length
  let numerator = 0, xDenom = 0, yDenom = 0
  for (let i = 0; i < xData.length; i++) {
    numerator += (xData[i] - xMean) * (yData[i] - yMean)
    xDenom += Math.pow(xData[i] - xMean, 2)
    yDenom += Math.pow(yData[i] - yMean, 2)
  }
  correlation.value = numerator / Math.sqrt(xDenom * yDenom)
}

const renderChart = () => {
  if (!Plotly || !chartDiv.value) return

  const xData = xValues.value.split(',').map(val => parseFloat(val.trim()))
  const yData = yValues.value.split(',').map(val => parseFloat(val.trim()))
  
  const scatterData = {
    type: 'scatter',
    mode: 'markers',
    x: xData,
    y: yData,
    marker: { size: 10, color: '#60a5fa' }
  }

  let trendLineData = null
  if (showTrendLine.value && xData.length > 1) {
    const { slope, intercept } = calculateLinearRegression(xData, yData)
    const trendX = [Math.min(...xData), Math.max(...xData)]
    const trendY = trendX.map(x => slope * x + intercept)

    trendLineData = {
      type: 'scatter',
      mode: 'lines',
      x: trendX,
      y: trendY,
      line: { color: '#ff4500', width: 2 },
      name: 'Đường xu hướng'
    }
  }

  const data = [scatterData]
  if (trendLineData) data.push(trendLineData)

  calculateStats()
  Plotly.newPlot(chartDiv.value, data, {
    title: { text: chartName.value, x: 0.5, xanchor: 'center' },
    xaxis: { 
      showgrid: showGrid.value,
      title: { text: xLabel.value }
    },
    yaxis: { 
      showgrid: showGrid.value,
      title: { text: yLabel.value }
    },
    margin: { t: 60, b: 60, l: 50, r: 20 },
    responsive: true,
    autosize: true
  }, {
    responsive: true
  })

  const { $katex } = useNuxtApp()
  if ($katex) {
    if (formulaRef.value) {
      $katex.render(
        "R = \\frac{\\sum (X_i - \\bar{X})(Y_i - \\bar{Y})}{\\sqrt{\\sum (X_i - \\bar{X})^2 \\sum (Y_i - \\bar{Y})^2}}",
        formulaRef.value,
        { displayMode: true, throwOnError: false }
      )
    }
    if (note1Ref.value) {
      const katexInline1 = note1Ref.value.querySelector('.katex-inline')
      if (katexInline1) {
        $katex.render("X_i, Y_i", katexInline1, { throwOnError: false })
      }
    }
    if (note2Ref.value) {
      const katexInline2 = note2Ref.value.querySelector('.katex-inline')
      if (katexInline2) {
        $katex.render("\\bar{X}, \\bar{Y}", katexInline2, { throwOnError: false })
      }
    }
  }
}

const downloadChart = () => {
  console.log('Tải xuống biểu đồ')
}

onMounted(async () => {
  if (process.client) {
    Plotly = await import('plotly.js-dist')
    renderChart()
  }
})

watch([chartName, xLabel, yLabel, xValues, yValues, showGrid, showTrendLine], renderChart)
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
}

@media (min-width: 640px) {
  .chart-container {
    height: 450px;
  }
}

@media (max-width: 639px) {
  .chart-container {
    height: 50vh;
  }
}

.katex-formula {
  display: inline-block;
  width: 100%;
}

.katex-inline {
  display: inline-block;
  vertical-align: middle;
}
</style>