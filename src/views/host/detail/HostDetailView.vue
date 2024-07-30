<script setup lang="ts">
import { ref } from 'vue'

import MasonryWall from '@yeger/vue-masonry-wall'
import CPUCard from '../components/CPUCard.vue'
import MEMCard from '../components/MEMCard.vue'
import NetworkCard from '../components/NetworkCard.vue'
import DiskCard from '../components/DiskCard.vue'
import ProcessCard from '@/views/host/components/ProcessCard.vue'
import useTimer from '@/hooks/useTimer'
import { Host } from '@/views/host/HostIndexView'
import { useRoute } from 'vue-router'

const route = useRoute()

async function getData(): Promise<Host.HostStats> {
  return await Host.getHostStats(route.params.id as string)
}

const {result, isFirstLoading} = useTimer<Host.HostStats>(getData)

const items = ['cpu', 'mem', 'network', 'disk']
</script>

<template>
  <div v-loading="isFirstLoading" element-loading-text="loading" class="p-4 flex flex-row gap-4 absolute inset-0 overflow-hidden">
    <masonry-wall class="basis-2/3 overflow-y-auto scroll-none" :items="items" :min-columns="1" :max-columns="3"
                  :gap="16">
      <template #default="{ item }">
        <CPUCard v-if="item==='cpu'" :data="result?.cpuInfo" />
        <DiskCard v-if="item==='disk'" :data="result?.diskInfo" />
        <NetworkCard v-if="item==='network'" :data="result?.networkInfo" />
        <MEMCard v-if="item==='mem'" :data="result?.memInfo" />
      </template>
    </masonry-wall>
    <div class="basis-1/3 overflow-y-auto scroll-none">
      <ProcessCard :data="result?.processInfo" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scroll-none::-webkit-scrollbar {
  display: none;
}
</style>