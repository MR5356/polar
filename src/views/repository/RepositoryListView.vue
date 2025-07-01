<script setup lang="ts">
import withLoading from '@/utils/loading'
import { ref } from 'vue'
import { type Repository, listRepositories } from '@/views/repository/Repository'
import { Refresh, Github } from '@icon-park/vue-next'

const rawData = ref<Repository[] | undefined>([])
const page = ref(1)
const size = ref(1000)

const listRepository = async () => {
  await withLoading(async () => {
    const temp = await listRepositories(page.value, size.value)
    rawData.value = temp.data
  })
}
listRepository()

const openLink = (url: string) => {
  window.open(url, "_blank");
};


</script>

<template>
  <div class="p-4 select-none flex flex-col gap-4">
    <div class="flex justify-between items-center text-gray-700 dark:text-gray-300">
      <div class="flex gap-2 items-center">
        <div
          class="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-1 px-2 cursor-pointer flex items-center gap-2"
          @click="() => openLink('https://github.com/apps/toodofun/installations/new')"
        >
          <Github theme="outline" />
          <div class="text-sm">{{$t("repository.bind:github")}}</div>
        </div>
      </div>
      <div class="flex gap-2 items-center">
        <div
          class="bg-white dark:bg-slate-700 shadow-lg rounded-lg p-1 px-2 cursor-pointer"
          @click="listRepository"
        >
          <Refresh theme="outline" />
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="item in rawData" :key="item.id" class="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-4 flex flex-col gap-2"
      >
        <h2 class="text-xl cursor-pointer font-semibold line-clamp-1" @click="()=>openLink(item.htmlURL)">{{ item.name }}</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 h-[40px] line-clamp-2">{{ item.description }}</p>
        <div class="flex items-center gap-2 text-xs">
          <el-avatar :size="20" :src="`https://avatars.githubusercontent.com/u/${item.ownerID}?s=40&v=4`" />
          <div class="text-slate-500">{{item.owner}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
