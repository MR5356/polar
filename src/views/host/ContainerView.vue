<script lang="ts" setup>
import { useRoute } from 'vue-router'
import ContainerView from '@/components/ContainerView.vue'

const route = useRoute()
const id = route.params.id
</script>

<template>
  <div class="w-full h-full p-4">
    <ContainerView :host-id="id" />
  </div>
</template>

<style lang="scss" scoped></style>
