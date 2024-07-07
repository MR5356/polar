<script setup lang="ts">
import * as echarts from 'echarts/core'
import { LegendComponent, TooltipComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { LabelLayout } from 'echarts/features'
import { useI18n } from 'vue-i18n'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Health } from '@/views/health/HealthIndexView'

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout])

const { t } = useI18n()

const interval = ref()
const mainChart = ref()
const mainCharts = ref()
const statusChart = ref()
const statusCharts = ref()
const healthStatistics = ref<Health.Statistics>(null as Health.Statistics)

onMounted(() => {
  interval.value = setInterval(init, 1000)
})

onBeforeUnmount(() => {
  clearInterval(interval.value)
})

const init = async () => {
  await Health.getHealthStatistics().then((res => {
    healthStatistics.value = res
    if (mainChart.value) {
      if (!mainCharts.value) {
        mainCharts.value = echarts.init(mainChart.value)
      }
      mainCharts.value.setOption(getOption([
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
      statusCharts.value.setOption(getOption([
        { value: res.up, name: 'up' },
        { value: res.down, name: 'down' },
        { value: res.unknown, name: 'unknown' },
        { value: res.error, name: 'error' }
      ]))
    }
  }))
}

function getOption(data: any): any {
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
          borderRadius: '10%'
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
  <div class="grid grid-cols-2 gap-4">
    <div class="col-span-1 h-[250px] bg-white bg-opacity-60 dark:bg-slate-600 rounded-lg p-4">
      <div class="text-sm font-bold border-green-400 border-l-4 rounded pl-1">检查类型统计</div>
      <div class="w-full h-full" ref="mainChart"></div>
    </div>
    <div class="col-span-1 h-[250px] bg-white bg-opacity-60 dark:bg-slate-600 rounded-lg p-4">
      <div class="text-sm font-bold border-green-400 border-l-4 rounded pl-1">运行状态统计</div>
      <div class="w-full h-full" ref="statusChart"></div>
    </div>
  </div>
</template>

<style scoped>

</style>