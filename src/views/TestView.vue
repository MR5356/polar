<script lang="ts" setup>
import { ref } from 'vue'
import LogView from '@/components/LogView.vue';

const v = ref('package main')

</script>

<template>
  <div class="w-full h-full p-4">
    <!-- <ContainerView host-id="5d0243bd-4814-41de-848a-e7c80fc39290" /> -->
<!--    <CodeEditor language="go" :read-only="false" v-model:value="v" />-->
    <LogView />
  </div>
</template>