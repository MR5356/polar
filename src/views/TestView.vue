<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import LogView from '@/components/LogView.vue';
import useTimer from '@/hooks/useTimer';

const test = ref(null)

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const {result, isFirstLoading} = useTimer(async ()=> {
  return new Date()
}, {root: test})

watchEffect(()=>{
  console.log(result.value, isFirstLoading.value);  
})

</script>

<template>
  <div class="w-full h-[300px]">
    <h1 v-for="i in 100" :key="i">{{ i }}</h1>
    <div v-loading="isFirstLoading" ref="test"><LogView /></div>
  </div>
</template>