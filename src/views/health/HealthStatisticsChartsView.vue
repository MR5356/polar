<script setup lang="ts">
import * as echarts from 'echarts/core'
import { LegendComponent, TooltipComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { LabelLayout } from 'echarts/features'
import { useI18n } from 'vue-i18n'
import { onBeforeUnmount, ref, watch } from 'vue'
import { Health } from '@/views/health/HealthIndexView'
import useSSE from '@/hooks/useSSE'

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout])

const { t } = useI18n()

const mainChart = ref()
const mainCharts = ref()
const statusChart = ref()
const statusCharts = ref()
const healthStatistics = ref<Health.Statistics>(null as Health.Statistics)

window.addEventListener("resize", () => {
  if (mainCharts.value) {
    mainCharts.value.resize()
  }
  if (statusCharts.value) {
    statusCharts.value.resize()
  }
})

const {status, data, close} = useSSE<Health.Statistics>("/health/statistics/sse", [], {
  autoReconnect: true
})



onBeforeUnmount(() => {
  close()
})

const init = (res: Health.Statistics) => {
  if (res === null) {
    return
  }
  
  healthStatistics.value = res
  if (mainChart.value) {
    if (!mainCharts.value) {
      mainCharts.value = echarts.init(mainChart.value)
    }
    mainCharts.value.setOption(getPieOption([
      { value: res.ping, name: 'ping' },
      { value: res.http, name: 'http' },
      { value: res.ssh, name: 'ssh' },
      { value: res.database, name: 'database' }
    ]))
  }
  if (statusChart.value) {
    if (!statusCharts.value) {
      statusCharts.value = echarts.init(statusChart.value)
    }
    statusCharts.value.setOption(getPieOption([
      { value: res.up, name: 'up' },
      { value: res.down, name: 'down' },
      { value: res.unknown, name: 'unknown' },
      { value: res.error, name: 'error' }
    ]))
  }
}

watch(data, (newData) => {
  init(newData)
})

function getPieOption(data: any): any {
  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: '15%',
      bottom: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold'
      },
      formatter: (name: string) => {
        return `${t('health.' + name)}: ${healthStatistics.value[name] || 0}`
      }
    },
    series: [
      {
        name: 'Checker',
        type: 'pie',
        radius: ['42%', '66%'],
        avoidLabelOverlap: false,
        padAngle: 0,
        center: ['70%', '50%'],
        itemStyle: {
          borderRadius: '10%',
          color: function (params) {
            const colorList = [
              ['#95a2ff'],
              ['#fa8080'],
              ['#ffc076'],
              ['#87e885'],
              ['#3cb9fc'],
              ['#73abf5'],
              ['#cb9bff'],
              ['#434348'],
              ['#90ed7d'],
              ['#f7a35c'],
              ['#8085e9']
            ]
            const index = params.dataIndex % colorList.length
            if (colorList[index].length === 1) {
              return colorList[index][0]
            }
            const colorStops = colorList[index].map((color, i, arr) => ({
              offset: i / (arr.length - 1),
              color
            }))
            return new echarts.graphic.LinearGradient(0, 0, 0, 1, colorStops)
          }
        },
        label: {
          show: false,
          position: 'center',
          formatter: '{d}%\n{b}',
          color: ''
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        data: data
      }
    ]
  }
}
</script>

<template>
  <div class="grid grid-cols-2 gap-4 overflow-hidden">
    <div class="col-span-2 lg:col-span-1 min-w-[350px] h-[250px] bg-white bg-opacity-60 dark:bg-slate-600 rounded-lg p-4">
      <div class="text-sm font-bold border-green-400 border-l-4 rounded pl-1">检查类型统计</div>
      <div class="w-full h-full" ref="mainChart"></div>
    </div>
    <div class="col-span-2 lg:col-span-1 min-w-[350px] h-[250px] bg-white bg-opacity-60 dark:bg-slate-600 rounded-lg p-4">
      <div class="text-sm font-bold border-green-400 border-l-4 rounded pl-1">运行状态统计</div>
      <div class="w-full h-full" ref="statusChart"></div>
    </div>
  </div>
</template>

<style scoped>

</style>