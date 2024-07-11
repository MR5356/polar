<script lang="ts" setup>
import { ref } from 'vue'
import CodeEditor from '@/components/CodeEditor.vue'
import ContainerView from '@/components/ContainerView.vue'

const v = ref('package main')

</script>

<template>
  <div class="w-full h-full">
    <ContainerView />
<!--    <CodeEditor language="go" :read-only="false" v-model:value="v" />-->
  </div>
</template>