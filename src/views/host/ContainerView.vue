<script lang="ts" setup>
import { useRoute } from 'vue-router'
import ContainerView from '@/components/ContainerView.vue'

const route = useRoute()
const id = route.params.id as string
const driver = route.params.driver as string
</script>

<template>
  <div class="w-full h-full p-4">
    <ContainerView :host-id="id" :driver="driver" />
  </div>
</template>

<style lang="scss" scoped></style>
