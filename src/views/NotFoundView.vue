<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()

</script>

<template>
  <div class="absolute inset-0 text-center flex justify-center flex-col items-center gap-10">
    <div class="absolute top-4 left-6">
      <router-link to="/">
        <div class="flex gap-2 items-center">
          <img class="w-8 h-8" :src="systemStore.website.logo" alt="logo">
          <div class="text-2xl font-bold text-teal-400">{{ systemStore.website.title }}.</div>
        </div>
      </router-link>
    </div>
    <div />
    <img class="w-[20%] min-w-[200px] mt-[-100px]" src="../assets/404.svg" alt="404" />
    <div class="text-sm" v-html="$t('404.message')"></div>
    <router-link to="/">
      <div class="flex gap-2 items-center">
        <div class="text-2xl font-bold text-teal-400">{{ $t('home') }}</div>
      </div>
    </router-link>
  </div>
</template>

<style scoped></style>
