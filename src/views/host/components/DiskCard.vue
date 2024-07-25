<script setup lang="ts">
import numeral from 'numeral'
import ColumnarProgressBar from '@/components/ColumnarProgressBar.vue'

export interface DiskInfo {
  partition: string
  size_bytes: number
  used_size_bytes: number
  mount_point: string
  fs_type: string
  read_speed_Bps: number
  write_speed_Bps: number
  read_iops: number
  write_iops: number
  read_latency_ms: number
  write_latency_ms: number
  total_read_bytes: number
  total_write_bytes: number
}

defineProps({
  data: {
    type: Array<DiskInfo>,
    required: true
  }
})
</script>

<template>
  <div class="rounded-lg flex flex-col gap-4 min-w-[500px] text-sm select-none">
    <div v-for="item in data" :key="item.partition" class="bg-white p-4 rounded-lg flex flex-col">
      <div class="grid grid-cols-2 items-center">
        <div class="flex flex-col gap-1">
          <div class="text-xs font-medium">{{ item.mount_point }}</div>
          <div class="text-xs text-slate-500">{{ item.partition }}</div>
        </div>
        <div class="flex gap-2 text-sm text-right items-center justify-end">
          <div class="flex flex-col gap-1">
            <div class="text-xs uppercase text-slate-500">{{ item.fs_type }}</div>
            <div class="text-xs font-medium">{{ numeral(item.used_size_bytes).format('0b') }}&nbsp;/&nbsp;<span class="text-slate-500 font-normal">{{ numeral(item.size_bytes).format('0b') }}</span></div>
          </div>
          <div>
            <ColumnarProgressBar :scale="Number((item.used_size_bytes / item.size_bytes * 100).toFixed(0))" label="" />
          </div>
        </div>
      </div>
      <div class="h-[1px] bg-slate-200 my-2"></div>
      <div class="grid grid-cols-5 gap-2 text-sm">
        <div class="grid grid-cols-1">
          <div>&nbsp;</div>
          <div class="text-slate-500">{{ $t('component.diskCard.read') }}</div>
          <div class="text-slate-500">{{ $t('component.diskCard.write') }}</div>
        </div>
        <div class="grid grid-cols-1">
          <div class="text-slate-500 text-right">{{ $t('component.diskCard.speed') }}</div>
          <div class="text-xs font-medium text-right">{{ numeral(item.read_speed_Bps).format('0b') }} / s</div>
          <div class="text-xs font-medium text-right">{{ numeral(item.write_speed_Bps).format('0b') }} / s</div>
        </div>
        <div class="grid grid-cols-1">
          <div class="text-slate-500 text-right">{{ $t('component.diskCard.bytes') }}</div>
          <div class="text-xs font-medium text-right">{{ numeral(item.total_read_bytes).format('0b') }}</div>
          <div class="text-xs font-medium text-right">{{ numeral(item.total_write_bytes).format('0b') }}</div>
        </div>
        <div class="grid grid-cols-1">
          <div class="text-slate-500 text-right">{{ $t('component.diskCard.iops') }}</div>
          <div class="text-xs font-medium text-right">{{ item.read_iops }}</div>
          <div class="text-xs font-medium text-right">{{ item.write_iops }}</div>
        </div>
        <div class="grid grid-cols-1">
          <div class="text-slate-500 text-right">{{ $t('component.diskCard.latency') }}</div>
          <div class="text-xs font-medium text-right">{{ item.read_latency_ms }}</div>
          <div class="text-xs font-medium text-right">{{ item.write_latency_ms }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>