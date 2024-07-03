<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()
const route = useRoute()
const router = useRouter()
const activeKey = ref<string>(route.path)

const onEdit = (targetKey: string | MouseEvent, action: string) => {
  systemStore.removeTab(targetKey as string)
  history.go(-1)
}


const onClick = (targetKey: string) => {
  const tab = systemStore.tabs.find(pane => pane.key === targetKey)

  if (tab) {
    activeKey.value = tab.key
    router.push(tab.key)
  }
}

</script>

<template>
  <a-tabs class="select-none bg-indigo-100 bg-opacity-60 dark:bg-slate-900" v-model:activeKey="$route.path"
          hide-add type="editable-card"
          @edit="onEdit" v-if="$route.meta.tabbed" @change="onClick">
    <a-tab-pane class="relative" v-for="pane in systemStore.tabs" :key="pane.key" :tab="$t('navigation.'+pane.title)"
                :closable="systemStore.tabs.length > 1">
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

:deep(.ant-tabs-tab-active) {
  background: #fafafa !important;
  border-radius: 0.8rem 0.8rem 0 0 !important;
  border-bottom-color: #fafafa !important;

  &::before {
    content: '';
    position: absolute;
    bottom: -1px;
    left: -0.8rem;
    width: 0.8rem;
    height: 0.8rem;
    background: radial-gradient(circle at 0% 0%, transparent 0.8rem, #fafafa 0);
    animation: inherit;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    right: -0.8rem;
    width: 0.8rem;
    height: 0.8rem;
    background: radial-gradient(circle at 100% 0%, transparent 0.8rem, #fafafa 0);
    animation: inherit;
  }
}

:deep(.ant-tabs-tab) {
  padding-top: 4px !important;
  padding-bottom: 6px !important;
  margin-top: 8px !important;
  border: 0 !important;
  background: transparent;
}
</style>