<script setup lang="ts">
import numeral from 'numeral'
import type { PropType } from 'vue'
import { Host } from '@/views/host/HostIndexView'

defineProps({
  data: {
    type: Object as PropType<Host.MemInfo | null>,
    // required: true
  }
})

</script>

<template>
  <div class="bg-white p-4 rounded-lg flex items-center justify-between min-w-[420px] h-fit select-none">
    <div class="flex-grow grid grid-cols-3">
      <div class="flex flex-col gap-1 p-2">
        <div class="text-sm text-slate-500">{{ $t('component.memCard.total') }}</div>
        <div class="text-xs font-medium">{{ numeral(data?.total).format('0.0b') }}</div>
      </div>
      <div class="flex flex-col gap-1 p-2">
        <div class="text-sm text-slate-500">{{ $t('component.memCard.used') }}</div>
        <div class="text-xs font-medium">{{ numeral(data?.used).format('0.0b') }}</div>
      </div>
      <div class="flex flex-col gap-1 p-2">
        <div class="text-sm text-slate-500">{{ $t('component.memCard.free') }}</div>
        <div class="text-xs font-medium">{{ numeral(data?.free).format('0.0b') }}</div>
      </div>
      <div class="flex flex-col gap-1 p-2">
        <div class="text-sm text-slate-500">{{ $t('component.memCard.shared') }}</div>
        <div class="text-xs font-medium">{{ numeral(data?.shared).format('0.0b') }}</div>
      </div>
      <div class="flex flex-col gap-1 p-2">
        <div class="text-sm text-slate-500">{{ $t('component.memCard.buffcache') }}</div>
        <div class="text-xs font-medium">{{ numeral(data?.buffcache).format('0.0b') }}</div>
      </div>
      <div class="flex flex-col gap-1 p-2">
        <div class="text-sm text-slate-500">{{ $t('component.memCard.available') }}</div>
        <div class="text-xs font-medium">{{ numeral(data?.available).format('0.0b') }}</div>
      </div>
    </div>

    <div class="w-fit h-full text-center flex items-center px-4">
      <a-progress
        :stroke-color="{
        '0%': '#5ec269',
        '50%': '#e2b53e',
        '100%': '#dd524c',
      }"
        type="circle"
        :percent="Number(((data?.used + data?.shared) / data?.total * 100).toFixed(0))"
        :size="88"
      />
    </div>
  </div>
</template>

<style scoped>

</style>