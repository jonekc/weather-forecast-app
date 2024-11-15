<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'

export type ChartProps = {
  labels: string[]
  data: number[]
  axisName: string
  formatter: (value: string) => string
}

const { labels, data, axisName, formatter } = defineProps<ChartProps>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const renderChart = () => {
  if (chartInstance && labels && data) {
    chartInstance.setOption({
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: { formatter },
      },
      yAxis: {
        type: 'value',
        name: axisName,
      },
      series: [
        {
          data,
          type: 'line',
          smooth: true,
        },
      ],
      tooltip: {
        trigger: 'axis',
        formatter: (params: echarts.TooltipComponentFormatterCallbackParams) => {
          const data = Array.isArray(params) ? params[0] : params
          return `${formatter(data.name)}: ${data.data}`
        },
      },
    })
  }
}

const resizeChart = () => {
  chartInstance?.resize()
}

// Initialize and resize chart on mount
onMounted(() => {
  chartInstance = echarts.init(chartRef.value)
  renderChart()

  window.addEventListener('resize', resizeChart)
})

// Re-render chart when data changes
watch([labels, data], renderChart)

// Clean up on unmount
onUnmounted(() => {
  if (chartInstance) {
    window.removeEventListener('resize', resizeChart)
    chartInstance.dispose()
  }
})
</script>

<template>
  <div ref="chartRef" class="line-chart"></div>
</template>

<style scoped>
.line-chart {
  width: 100%;
  height: 400px;
}
</style>
