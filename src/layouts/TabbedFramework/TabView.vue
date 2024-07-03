<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'

const panes = ref<{ title: string; content: string; key: string; closable?: boolean }[]>([])
const activeKey = ref<string>("")
const newTabIndex = ref(0)

const remove = (targetKey: string) => {
  let lastIndex = 0
  panes.value.forEach((pane, i) => {
    if (pane.key === targetKey) {
      lastIndex = i - 1
    }
  })
  panes.value = panes.value.filter(pane => pane.key !== targetKey)
  if (panes.value.length && activeKey.value === targetKey) {
    if (lastIndex >= 0) {
      activeKey.value = panes.value[lastIndex].key
    } else {
      activeKey.value = panes.value[0].key
    }
  }
}
const add = () => {
  activeKey.value = `newTab${++newTabIndex.value}`
  panes.value.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey.value })
}
add()

const onEdit = (targetKey: string | MouseEvent, action: string) => {
  if (action === 'add') {
    add()
  } else {
    remove(targetKey as string)
  }
}
</script>

<template>
  <a-tabs class="absolute inset-0 bg-indigo-100 bg-opacity-60 dark:bg-slate-900" v-model:activeKey="activeKey" hide-add type="editable-card"
          @edit="onEdit">
    <a-tab-pane class="relative" v-for="pane in panes" :key="pane.key" :tab="pane.title"
                :closable="panes.length > 1">
      <RouterView />
    </a-tab-pane>
  </a-tabs>
</template>

<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin: 0;
}
:deep(.ant-tabs-content) {
  height: 100%;
}
</style>