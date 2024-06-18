<script setup lang="ts">
import { ref } from 'vue';
import { Host } from './HostIndexView';

const hostGroupsList = ref<Host.Group[]>([])
Host.getGroups().then((res) => {
  console.log(res)
  hostGroupsList.value = res
})
</script>

<template>
{{ hostGroupsList }}
</template>

<style scoped>

</style>