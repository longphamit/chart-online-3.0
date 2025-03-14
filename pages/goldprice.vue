<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div class="max-w-6xl w-full">
        <!-- Tiêu đề -->
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-10">
          Giá Vàng SJC tại Hồ Chí Minh - Biểu Đồ Theo Ngày
        </h1>
        <!-- Mô tả -->
        <p class="text-gray-600 text-center mb-6">
          Xem xu hướng giá vàng SJC 1L, 10L, 1KG tại Hồ Chí Minh theo thời gian.
        </p>
  
        <!-- Container chính -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Khu vực tùy chỉnh -->
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span class="text-blue-500">⚙️</span> Tùy Chỉnh Biểu Đồ
              </h3>
  
              <!-- Tên biểu đồ -->
              <UFormGroup label="Tên biểu đồ">
                <UTextarea v-model="chartName" placeholder="Nhập tên biểu đồ..." />
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
            <div class="mt-6 p-4 bg-gray-100 rounded-lg">
              <h4 class="text-md font-medium mb-2">Thông tin giá vàng</h4>
              <p class="text-sm text-gray-600">
                Biểu đồ hiển thị giá mua và giá bán của Vàng SJC 1L, 10L, 1KG tại Hồ Chí Minh từ ngày {{ formatDate(firstDate) }} đến {{ formatDate(lastDate) }}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted, onUnmounted } from 'vue'
  
  // SEO optimization
  useHead({
    title: 'Giá Vàng SJC tại Hồ Chí Minh - Biểu Đồ Theo Ngày',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Xem biểu đồ giá vàng SJC 1L, 10L, 1KG tại Hồ Chí Minh theo ngày. Cập nhật xu hướng giá mua và bán mới nhất.'
      },
      {
        name: 'keywords',
        content: 'giá vàng Hồ Chí Minh, biểu đồ giá vàng, vàng SJC, giá vàng theo ngày'
      }
    ]
  })
  
  // Data
  const chartName = ref('Giá vàng SJC tại Hồ Chí Minh')
  const goldData = ref([
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"88,500","BuyValue":88500000.0000,"Sell":"90,500","SellValue":90500000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1740762000000)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"88,300","BuyValue":88300000.0000,"Sell":"90,300","SellValue":90300000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1740792347063)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"88,500","BuyValue":88500000.0000,"Sell":"90,500","SellValue":90500000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1740792653100)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"89,000","BuyValue":89000000.0000,"Sell":"91,000","SellValue":91000000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1740965373320)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"89,600","BuyValue":89600000.0000,"Sell":"91,600","SellValue":91600000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741051798567)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"90,000","BuyValue":90000000.0000,"Sell":"92,000","SellValue":92000000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741073479720)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"90,100","BuyValue":90100000.0000,"Sell":"92,100","SellValue":92100000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741073637817)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"90,700","BuyValue":90700000.0000,"Sell":"92,700","SellValue":92700000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741080824380)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"90,700","BuyValue":90700000.0000,"Sell":"92,700","SellValue":92700000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741137905537)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"90,700","BuyValue":90700000.0000,"Sell":"92,700","SellValue":92700000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741224990343)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"91,000","BuyValue":91000000.0000,"Sell":"93,000","SellValue":93000000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741226674433)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"90,700","BuyValue":90700000.0000,"Sell":"92,700","SellValue":92700000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741250681813)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"90,700","BuyValue":90700000.0000,"Sell":"92,700","SellValue":92700000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741311419080)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"90,900","BuyValue":90900000.0000,"Sell":"92,900","SellValue":92900000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741334473703)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"91,100","BuyValue":91100000.0000,"Sell":"93,100","SellValue":93100000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741338885443)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"90,900","BuyValue":90900000.0000,"Sell":"92,900","SellValue":92900000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741397073143)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"91,100","BuyValue":91100000.0000,"Sell":"93,100","SellValue":93100000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741569859153)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"90,900","BuyValue":90900000.0000,"Sell":"92,900","SellValue":92900000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741595446483)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"90,600","BuyValue":90600000.0000,"Sell":"92,600","SellValue":92600000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741656163333)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"90,800","BuyValue":90800000.0000,"Sell":"92,800","SellValue":92800000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741659975820)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"91,000","BuyValue":91000000.0000,"Sell":"93,000","SellValue":93000000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741684821723)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"91,000","BuyValue":91000000.0000,"Sell":"93,000","SellValue":93000000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741743199140)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"91,600","BuyValue":91600000.0000,"Sell":"93,300","SellValue":93300000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741744167603)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"91,600","BuyValue":91600000.0000,"Sell":"93,300","SellValue":93300000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741756256923)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"91,800","BuyValue":91800000.0000,"Sell":"93,500","SellValue":93500000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741760016890)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"92,500","BuyValue":92500000.0000,"Sell":"94,200","SellValue":94200000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741828680937)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"92,900","BuyValue":92900000.0000,"Sell":"94,400","SellValue":94400000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741835048047)\/"},
    {"Id":0,"TypeName":"Vàng SJC 1L, 10L, 1KG","BranchName":"Hồ Chí Minh","Buy":"94,100","BuyValue":94100000.0000,"Sell":"95,600","SellValue":95600000.0000,"BuyDiffer":null,"BuyDifferValue":0,"SellDiffer":null,"SellDifferValue":0,"GroupDate":"\/Date(1741915907280)\/"}
  ])
  
  const lineChartDiv = ref(null)
  let Plotly = null
  
  // Xử lý ngày tháng (chỉ hiển thị ngày)
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }
  
  const firstDate = computed(() => parseInt(goldData.value[0].GroupDate.match(/\d+/)[0]))
  const lastDate = computed(() => parseInt(goldData.value[goldData.value.length - 1].GroupDate.match(/\d+/)[0]))
  
  // Hàm vẽ biểu đồ
  const renderChart = () => {
    if (!Plotly || !lineChartDiv.value) return
  
    const dates = goldData.value.map(item => parseInt(item.GroupDate.match(/\d+/)[0]))
    const buyPrices = goldData.value.map(item => parseFloat(item.Buy.replace(',', '.')))
    const sellPrices = goldData.value.map(item => parseFloat(item.Sell.replace(',', '.')))
  
    const lineData = [
      {
        type: 'scatter',
        mode: 'lines+markers',
        x: dates,
        y: buyPrices,
        name: 'Giá mua',
        line: { color: '#1d4ed8', width: 2 },
        marker: { color: '#1d4ed8', size: 8 }
      },
      {
        type: 'scatter',
        mode: 'lines+markers',
        x: dates,
        y: sellPrices,
        name: 'Giá bán',
        line: { color: '#f59e0b', width: 2 },
        marker: { color: '#f59e0b', size: 8 }
      }
    ]
  
    const layout = {
      title: { text: chartName.value, x: 0.5, xanchor: 'center' },
      xaxis: { 
        title: 'Ngày', 
        showgrid: false,
        type: 'date',
        tickformat: '%d/%m/%Y' // Chỉ hiển thị ngày/tháng/năm
      },
      yaxis: { 
        title: 'Giá (triệu VNĐ)', 
        zeroline: false 
      },
      margin: { t: 60, b: 100, l: 50, r: 20 },
      responsive: true,
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
        filename: 'bieu-do-gia-vang-sjc-hcm', 
        width: 1000, 
        height: 600 
      })
    }
  }
  
  // Theo dõi thay đổi tên biểu đồ
  watch(chartName, () => {
    if (process.client && Plotly) {
      renderChart()
    }
  })
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;
    height: 300px;
  }
  
  @media (min-width: 640px) {
    .chart-container {
      height: 400px;
    }
  }
  
  @media (max-width: 639px) {
    .chart-container {
      height: 50vh;
    }
  }
  
  .min-h-screen {
    background-color: #f9fafb;
  }
  </style>