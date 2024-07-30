<script setup lang="ts">
import numeral from 'numeral'
import { Host } from '@/views/host/HostIndexView'

defineProps({
  data: {
    type: Array<Host.ProcessInfo | null>,
    // required: true
  }
})
</script>

<template>
  <div class="min-w-[320px] rounded-lg bg-white px-4 pb-4 flex flex-col gap-4">
    <div class="grid grid-cols-5 text-slate-500 text-sm sticky pt-4 top-0 bg-white">
      <div class="col-span-3 text-sm font-medium">Process</div>
      <div class="text-sm font-medium">CPU %</div>
      <div class="text-sm font-medium">Mem %</div>
      <div class="col-span-5 mt-2 h-[1px] bg-slate-300"></div>
    </div>
    <div class="grid grid-cols-5" v-for="(item, index) in data" :key="index">
      <div class="col-span-3 text-sm break-all truncate" :title="item.command">{{ item.command }}</div>
      <div class="text-sm tabular-nums">{{ numeral(item.cpu).format('0.00') }}%</div>
      <div class="text-sm tabular-nums">{{ numeral(item.mem).format('0.00') }}%</div>
    </div>
  </div>
</template>

<style scoped>

</style>