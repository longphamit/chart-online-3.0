<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div class="max-w-6xl w-full">
        <!-- Tiêu đề -->
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-10">
          Vẽ Biểu Đồ Box Plot Online - Công Cụ Miễn Phí
        </h1>
        <!-- Đoạn mô tả giới thiệu -->
        <p class="text-gray-600 text-center mb-6">
          Công cụ vẽ biểu đồ Box Plot online miễn phí giúp bạn phân tích và trực quan hóa dữ liệu nhiều nhóm. Nhập dữ liệu, tùy chỉnh và xem biểu đồ dễ dàng trên mọi thiết bị!
        </p>
  
        <div class="grid gap-8">
          <!-- Khu vực hiển thị biểu đồ -->
          <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
            <div ref="chartDiv" class="w-full chart-container"></div>
            <!-- Nội dung bổ sung cho SEO -->
            <div class="mt-6 p-4 bg-gray-100 rounded-lg">
              <h4 class="text-md font-medium mb-2">Biểu đồ Box Plot là gì?</h4>
              <p class="text-sm text-gray-600">
                Biểu đồ Box Plot (hộp và râu) là một công cụ thống kê dùng để hiển thị phân phối dữ liệu qua các giá trị như trung vị, tứ phân vị và giá trị ngoại lai. Đây là lựa chọn tuyệt vời để so sánh nhiều nhóm dữ liệu.
              </p>
            </div>
          </div>
  
          <!-- Khu vực cấu hình và nhập dữ liệu -->
          <div class="space-y-6">
            <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span class="text-blue-500">⚙️</span> Cấu Hình Biểu Đồ
              </h3>
  
              <div class="mb-4">
                <label class="text-gray-700 font-medium">Tên hiển thị biểu đồ</label>
                <UInput v-model="chartTitle" placeholder="Nhập tên biểu đồ..." />
              </div>
  
              <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span class="text-blue-500">📊</span> Nhập Dữ Liệu
              </h3>
  
              <table class="w-full border border-gray-200 rounded-lg">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border p-2">Tên nhóm</th>
                    <th class="border p-2">Dữ liệu (cách nhau bởi dấu phẩy)</th>
                    <th class="border p-2">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(group, index) in dataGroups" :key="index">
                    <td class="border p-2">
                      <UInput v-model="group.name" placeholder="Nhóm {{ index + 1 }}" />
                    </td>
                    <td class="border p-2">
                      <UTextarea v-model="group.values" placeholder="Nhập dữ liệu..." />
                    </td>
                    <td class="border p-2 text-center">
                      <UButton icon="i-heroicons-trash" color="red" @click="removeGroup(index)" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <UButton label="Thêm Nhóm" icon="i-heroicons-plus" class="mt-4 w-full" @click="addGroup" />
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
    title: 'Vẽ Biểu Đồ Box Plot Online - Công Cụ Miễn Phí',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Công cụ vẽ biểu đồ Box Plot online miễn phí, hỗ trợ phân tích và trực quan hóa dữ liệu nhiều nhóm. Nhập dữ liệu và xem biểu đồ nhanh chóng trên mọi thiết bị.'
      },
      {
        name: 'keywords',
        content: 'vẽ biểu đồ box plot, box plot online, công cụ vẽ box plot, biểu đồ hộp và râu, trực quan hóa dữ liệu'
      },
      { name: 'robots', content: 'index, follow' }
    ],
    link: [
      { rel: 'canonical', href: 'https://tomchart.com/boxplot' } // Thay bằng URL thực tế
    ]
  })
  
  let Plotly = null
  
  const chartTitle = ref('Biểu Đồ Box Plot Nhiều Nhóm')
  const dataGroups = ref([
    { name: 'Nhóm 1', values: '1, 2, 3, 4, 5' }
  ])
  const chartDiv = ref(null)
  
  const addGroup = () => {
    dataGroups.value.push({
      name: `Nhóm ${dataGroups.value.length + 1}`,
      values: ''
    })
  }
  
  const removeGroup = (index) => {
    dataGroups.value.splice(index, 1)
  }
  
  const renderChart = () => {
    if (!Plotly || !chartDiv.value) return
  
    const traces = dataGroups.value.map(group => {
      const data = group.values.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val))
      return {
        type: 'box',
        y: data,
        name: group.name,
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: 0,
        marker: { color: '#60a5fa' },
        line: { color: '#ff4500' }
      }
    })
  
    const layout = {
      title: { text: chartTitle.value, x: 0.5, xanchor: 'center' },
      xaxis: { showgrid: true },
      yaxis: { title: { text: 'Giá trị' }, showgrid: true },
      margin: { t: 60, b: 60, l: 50, r: 20 },
      responsive: true,
      autosize: true
    }
  
    Plotly.newPlot(chartDiv.value, traces, layout, { responsive: true })
  }
  
  onMounted(async () => {
    if (process.client) {
      Plotly = await import('plotly.js-dist')
      renderChart()
    }
  })
  
  watch([dataGroups, chartTitle], renderChart, { deep: true })
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
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  th {
    background-color: #f4f4f4;
  }
  </style>