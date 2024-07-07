<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import moment from 'moment';

const interval = ref(null);
const time = ref(moment().format("HH:mm:ss"));
const date = ref(moment().format("dddd, MMMM, Do, YYYY"));

onMounted(() => {
  interval.value = setInterval(() => {
    time.value = moment().format("HH:mm:ss");
    date.value = moment().format("dddd, MMMM, Do, YYYY");
  }, 500);
})

onBeforeUnmount(() => {
  clearInterval(interval.value);
})

</script>

<template>
  <div class="bg-gradient-to-br from-cyan-50 dark:from-slate-900 to-sky-50 dark:to-slate-700 shadow-lg shadow-sky-200 rounded-2xl p-4 flex flex-col gap-1 font-momo">
    <div class="text-3xl font-medium tabular-nums text-slate-600">{{ time }}</div>
    <div class="text-xs text-slate-400">{{ date }}</div>
  </div>
</template>

<style scoped>

</style>