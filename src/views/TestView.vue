<script lang="ts" setup>
import { ref, shallowReactive } from 'vue'
import LogView from '@/components/LogView.vue';
import useTimer from '@/hooks/useTimer';
import Terminal from '@/components/TerminalView.vue'

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const logs = ref([])

let i = 1

for (let j = 0; j < 100; j ++) {
  logs.value.push({ id: i, level: 'Info', message: `aaaa: ${new Date()}` })  
  i ++
}

const {result, isFirstLoading} = useTimer(async ()=> {
  await sleep(1000)
  logs.value.push({ id: i, level: 'Info', message: `aaaa: ${new Date()}` })  
  i ++
  logs.value = [...logs.value]
})

</script>

<template>
  <Terminal class="w-full h-full" uri="/api/v1/host/container/271bb15e-cae7-4a5d-a28b-2da7a75ac3bf/docker/container/bc1ae10c8eb603f9205d220ebfe5657a3b89eb3291b7594220b023746815efea/terminal?user=root"  />
  <!-- <div class="w-[800px] h-[300px]">
    <LogView :logs="logs" />
  </div> -->
</template>