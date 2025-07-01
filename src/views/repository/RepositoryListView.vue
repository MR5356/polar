<script setup lang="ts">
import withLoading from '@/utils/loading'
import { ref } from 'vue'
import { type Repository, listRepositories } from '@/views/repository/Repository'

const rawData = ref<Repository[] | undefined>([])
const page = ref(1)
const size = ref(10)

const listRepository = async () => {
  await withLoading(async () => {
    const temp = await listRepositories(page.value, size.value)
    rawData.value = temp.data
  })
}
listRepository()

</script>

<template>
  <div class="p-4 select-none">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="item in rawData" :key="item.id" class="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-4">
        <h2 class="text-xl font-semibold">{{ item.name }}</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ item.description }}</p>
        <p v-if="item.scmType==='GitHub'" class="text-sm text-gray-500 dark:text-gray-300 mt-2"></p>
      </div>
    </div>
  </div>
</template>
