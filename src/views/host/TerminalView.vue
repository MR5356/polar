<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Terminal from '@/components/TerminalView.vue'
import { Copy } from '@icon-park/vue-next'
import { Host } from '@/views/host/HostIndexView'
import type { TreeProps } from 'ant-design-vue'
import difference from 'lodash-es/difference'

const treeData = ref<TreeProps['treeData']>([])

const openIds = ref<string[][]>([])

const route = useRoute()
const router = useRouter()
const expandedKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([])

const init = async () => {
  const res = await Host.getGroups()
  res.forEach((item) => {
    if (item.hosts.length == 0) return
    const hosts = []
    item.hosts.forEach((child) => {
      if (child.id == route.params.id) {
        selectedKeys.value = [child.id]
        expandedKeys.value = [item.id]
      }
      hosts.push({
        title: child.title,
        key: child.id,
        os: child.metaInfo?.os,
        isChild: true
      })
    })
    treeData.value.push({
      title: item.title,
      key: item.id,
      selectable: false,
      children: hosts
    })
  })
}

// 手风琴时使用
const handleExpand = (keys: string[], { expanded, node }) => {
  // node.parent add from 3.0.0-alpha.10
  const tempKeys = ((node.parent ? node.parent.children : treeData.value) || []).map(({ key }) => key)
  if (expanded) {
    expandedKeys.value = difference(keys, tempKeys).concat(node.key)
  } else {
    expandedKeys.value = keys
  }
}

const onSelect = (key: string[]) => {
  if (key.length == 0) {
    key = [route.params.id as string]
  }
  selectedKeys.value = key
}

init()

onBeforeUnmount(() => {
  window.name = ''
})

const openNew = (url: string) => {
  window.open(url, '_blank')
}

const onContextMenuClick = (treeKey: string, menuKey: string | number) => {
  switch (menuKey) {
    case 'newTab':
      openNew(`/terminal/${treeKey}`)
      break
    case 'newWindow':
      window.open(`/terminal/${treeKey}`, '_blank', 'toolbar=no,location=no,directories=no,status=no,menubar=no')
      break
    case 'right':
      break
    case 'bottom':
      break
    default:
      router.push(`/terminal/${treeKey}`)
  }
}
</script>

<template>
  <div class="absolute inset-0 overflow-hidden rounded-none flex items-center justify-center gap-0">
    <div
      class="absolute right-2 top-2 z-[999] bg-slate-100 rounded-lg p-1 opacity-70 hover:opacity-100"
      @click="openNew(route.fullPath)"
      title="复制终端"
    >
      <Copy class="w-full h-full" theme="two-tone" size="20" :fill="['#333', '#6abaf3']" />
    </div>
    <div class="h-full w-1/5 bg-slate-700 text-white">
      <a-tree
        class="bg-slate-700 text-white"
        v-model:selectedKeys="selectedKeys"
        v-model:expanded-keys="expandedKeys"
        :tree-data="treeData"
        autoExpandParent
        block-node
        @select="onSelect"
      >
        <template #title="{ title, isChild, os, key }">
          <a-dropdown :trigger="['contextmenu']">
            <router-link :to="isChild ? `/terminal/${key}` : ''">
              <div class="flex items-center gap-0 pl-2">
                <img v-if="isChild" :src="Host.getOsIcon(os)"
                     class="w-6 h-6 min-w-6 min-h-6 rounded-lg"
                     alt="logo">
                <span class="text-white m-2 capitalize">{{ title }}</span>
              </div>
            </router-link>
            <template #overlay>
              <a-menu @click="({ key: menuKey }) => onContextMenuClick(key, menuKey)">
                <a-menu-item key="newTab">{{ $t('terminal.open.newTab') }}</a-menu-item>
                <a-menu-item key="currentTab" v-if="key !== route.params.id">{{ $t('terminal.open.currentTab') }}</a-menu-item>
                <a-menu-item key="newWindow">{{ $t('terminal.open.newWindow') }}</a-menu-item>
                <a-menu-item key="right">{{ $t('terminal.open.right') }}</a-menu-item>
                <a-menu-item key="bottom">{{ $t('terminal.open.bottom') }}</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-tree>
    </div>
    <div class="grid grid-cols-1 w-full h-full gap-[1px] bg-sky-300">
      <Terminal class="w-full h-full" :uri="'/api/v1/host/terminal/' + route.params.id" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-tree-node-content-wrapper-normal),
:deep(.ant-tree-switcher) {
  line-height: 32px !important;
  padding: 0 0.25rem !important;
  align-self: center;
}

:deep(.ant-tree-node-content-wrapper-normal) {
  &:hover {
    background-color: rgba(0, 0, 0, 0.8) !important; /* 你想要的背景色 */
    border-radius: 0.8rem 0.8rem;
    margin-right: 0.25rem;
    position: relative;
  }
}

:deep(.ant-tree-switcher-icon) {
  font-size: 14px !important;
}

:deep(.ant-tree-node-selected) {
  background-color: #000 !important; /* 你想要的背景色 */
  border-radius: 0.8rem 0 0 0.8rem !important;
  margin-right: 0 !important;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -0.8rem;
    right: 0;
    width: 0.8rem;
    height: 0.8rem;
    background: radial-gradient(circle at 0% 0%, transparent 0.8rem, #000 0);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -0.8rem;
    right: 0;
    width: 0.8rem;
    height: 0.8rem;
    background: radial-gradient(circle at 0% 100%, transparent 0.8rem, #000 0);
  }
}
</style>
