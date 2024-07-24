<script lang="ts" setup>
import { ref, shallowReactive } from 'vue'
import LogView from '@/components/LogView.vue';
import useTimer from '@/hooks/useTimer';

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
  <div class="w-[800px] h-[300px]">
    <LogView :logs="logs" />
  </div>
</template>