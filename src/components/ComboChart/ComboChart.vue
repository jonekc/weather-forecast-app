<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { ComposeOption } from 'echarts/core'
import type { BarSeriesOption, LineSeriesOption } from 'echarts/charts'
import type { TooltipComponentOption } from 'echarts/components'
import type { XAXisComponentOption, YAXisComponentOption } from 'echarts/types/dist/option'
import type { TooltipFormatterCallback, TopLevelFormatterParams } from 'echarts/types/dist/shared'

type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TooltipComponentOption
  | XAXisComponentOption
  | YAXisComponentOption
>

export type ComboChartProps = {
  labels: string[]
  yAxis: YAXisComponentOption | YAXisComponentOption[]
  series: (BarSeriesOption | LineSeriesOption) | (BarSeriesOption | LineSeriesOption)[]
  formatter?: (value: string) => string
  tooltipFormatter?: TooltipFormatterCallback<TopLevelFormatterParams>
}

const { labels, yAxis, series, formatter, tooltipFormatter } = defineProps<ComboChartProps>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const renderChart = () => {
  if (chartInstance && labels && yAxis && series) {
    const option: ECOption = {
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: { formatter },
      },
      tooltip: {
        trigger: 'axis',
        formatter: tooltipFormatter,
      },
      yAxis,
      series,
    }
    chartInstance.setOption(option)
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
watch([() => labels, () => series], renderChart)

// Clean up on unmount
onUnmounted(() => {
  if (chartInstance) {
    window.removeEventListener('resize', resizeChart)
    chartInstance.dispose()
  }
})
</script>

<template>
  <div ref="chartRef" class="combo-chart"></div>
</template>

<style scoped>
.combo-chart {
  width: 100%;
  height: 400px;
}
</style>
