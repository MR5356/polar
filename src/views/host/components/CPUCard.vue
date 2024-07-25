<script setup lang="ts">
import { type PropType } from 'vue'
import ColoredProgressBar from '@/components/ColoredProgressBar.vue'
import { Triangle } from '@icon-park/vue-next'

const colors = ['bg-red-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500']

interface CPUInfo {
  percent: number
  system: number
  user: number
  iowait: number
  idle: number
  steal: number
  children?: CPUInfo[]
  uptime?: string
  load?: string
}

defineProps({
  data: {
    type: Object as PropType<CPUInfo>,
    required: true
  }
})

</script>

<template>
  <div class="bg-white p-4 rounded-lg flex flex-col gap-2 min-w-[500px] select-none">
    <div class="flex items-center justify-between gap-8">
      <div class="w-[50px]"><span class="text-4xl font-medium">{{ (data.percent * 100).toFixed(0) }}</span>&nbsp;<span
        class="text-slate-500">%</span></div>
      <div class="flex justify-between items-center flex-grow">
        <div class="flex flex-col gap-0 p-2">
          <div class="flex gap-1 items-center">
            <div class="w-1 h-3 rounded-full" :class="colors[0]"></div>
            <div class="text-sm text-slate-500">{{ $t('component.cpuCard.system') }}</div>
          </div>
          <div class="text-xs"><span class="font-medium">{{ (data.system * 100).toFixed(0) }}</span>&nbsp;<span
            class="text-slate-500">%</span></div>
        </div>
        <div class="flex flex-col gap-0 p-2">
          <div class="flex gap-1 items-center">
            <div class="w-1 h-3 rounded-full" :class="colors[1]"></div>
            <div class="text-sm text-slate-500">{{ $t('component.cpuCard.user') }}</div>
          </div>
          <div class="text-xs"><span class="font-medium">{{ (data.user * 100).toFixed(0) }}</span>&nbsp;<span
            class="text-slate-500">%</span></div>
        </div>
        <div class="flex flex-col gap-0 p-2">
          <div class="flex gap-1 items-center">
            <div class="w-1 h-3 rounded-full" :class="colors[2]"></div>
            <div class="text-sm text-slate-500">{{ $t('component.cpuCard.iowait') }}</div>
          </div>
          <div class="text-xs"><span class="font-medium">{{ (data.iowait * 100).toFixed(0) }}</span>&nbsp;<span
            class="text-slate-500">%</span></div>
        </div>
        <div class="flex flex-col gap-0 p-2">
          <div class="flex gap-1 items-center">
            <div class="w-1 h-3 rounded-full" :class="colors[3]"></div>
            <div class="text-sm text-slate-500">{{ $t('component.cpuCard.steal') }}</div>
          </div>
          <div class="text-xs"><span class="font-medium">{{ (data.steal * 100).toFixed(0) }}</span>&nbsp;<span
            class="text-slate-500">%</span></div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <ColoredProgressBar v-for="(item, index) in data.children" :key="index"
                          :percent="[item.system, item.user, item.iowait, item.steal]" :color="colors" />
    </div>
    <div class="flex flex-col gap-0">
      <div>
        <triangle theme="filled" size="8" fill="rgb(100 116 139)" :strokeWidth="3" />
      </div>
      <div class="flex items-center justify-between">
        <div class="flex flex-col flex-1 gap-0">
          <div class="text-sm text-slate-500">{{ $t('component.cpuCard.core') }}</div>
          <div class="font-medium text-xs">{{ data.children.length }}</div>
        </div>
        <div class="flex flex-col flex-1 gap-0">
          <div class="text-sm text-slate-500">{{ $t('component.cpuCard.idle') }}</div>
          <div class="font-medium text-xs">{{ (data.idle * 100).toFixed(0) }}&nbsp;<span class="text-slate-500">%</span></div>
        </div>
        <div class="flex flex-col flex-1 gap-0">
          <div class="text-sm text-slate-500">{{ $t('component.cpuCard.uptime') }}</div>
          <div class="font-medium text-xs">{{ data.uptime }}</div>
        </div>
        <div class="flex flex-col flex-1 gap-0">
          <div class="text-sm text-slate-500">{{ $t('component.cpuCard.load') }}</div>
          <div class="font-medium"><span class="text-xs">{{ data.load }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>