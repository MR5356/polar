<script setup lang="ts">
import { Health } from '@/views/health/HealthIndexView'
import type { PropType } from 'vue'
import HealthItem = Health.HealthItem

defineProps({
  health: {
    type: Object as PropType<HealthItem>,
    required: true
  }
})
</script>

<template>
  <div class="cursor-pointer bg-white dark:bg-slate-600 rounded-lg p-4 relative">
    <div class="absolute right-2 top-2 flex gap-1 items-center">
        <span class="relative flex h-2.5 w-2.5 items-center justify-center">
          <span v-if="health.status === Health.STATUS_UP"
                :class="'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ' + (health.rtt < Health.WarningRtt ? 'bg-green-500' : 'bg-yellow-500')"></span>
          <span
            :class="'relative inline-flex rounded-full h-2.5 w-2.5 ' + (health.status === Health.STATUS_UP ? health.rtt < Health.WarningRtt ? 'bg-green-500' : 'bg-yellow-500' : 'bg-red-500')"></span>
        </span>
      <div class="text-[0.6rem] w-8 flex justify-start items-center">
        <div>{{ health.status === Health.STATUS_UP ? health.rtt < 999 ? health.rtt : 999 : 0 }}</div>
        <div>ms</div>
      </div>
    </div>
    <div class="flex justify-start items-center gap-2">
      <div>
        <img :src="Health.getTypeIcon(health.type)"
             class="w-10 h-10 min-w-10 min-h-10 bg-slate-500 bg-opacity-30 dark:bg-slate-400 rounded-lg p-1"
             alt="logo">
      </div>
      <div class="flex flex-col">
        <div class="text-sm font-bold">{{ health.title }}</div>
        <div class="text-xs opacity-40">{{ health.desc }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>