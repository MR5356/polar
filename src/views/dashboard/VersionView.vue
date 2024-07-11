<script setup lang="ts">
import { ref } from 'vue'
import { Dashboard } from '@/views/dashboard/DashboardView'
import MarkdownIt from 'markdown-it'

const version = ref<Dashboard.VersionInfo>(null as Dashboard.VersionInfo)
const markdown = new MarkdownIt()

Dashboard.getVersionInfo().then((res) => {
  version.value = res
})

function openUrl(url: string) {
  window.open(url, '_blank')
}

function hasNewVersion(): Boolean {
  return version.value.latestVersion && version.value?.version !== version.value?.latestVersion
}

</script>

<template>
  <div v-if="version" class="relative bg-white dark:bg-slate-900 rounded-2xl p-4 flex flex-col gap-2 select-none">
    <span v-if="hasNewVersion()" class="absolute right-2 top-2 inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
    <div class="flex gap-2 justify-between items-center">
      <div class="text-xs">{{ $t('version.current') }}: {{ version?.version }}</div>
      <el-popover trigger="hover" class="p-0" :width="500">
        <template #reference>
          <div v-if="hasNewVersion()" class="text-xs cursor-pointer" @click="openUrl(version?.latestUrl)">{{ $t('version.latest') }}:
            {{ version?.latestVersion }}
          </div>
        </template>
        <template #default>
          <div v-if="hasNewVersion()">
<!--            <div class="text-xs font-medium">{{ $t('version.releaseNote') }}:</div>-->
            <div v-html="markdown.render(version?.latestInfo)"></div>
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<style scoped>

</style>