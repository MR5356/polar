<script setup lang="ts">
import { onBeforeUnmount, ref, h, type VNode } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Host } from '@/views/host/HostIndexView'
import type { TreeProps } from 'ant-design-vue'
import Terminal from '@/components/TerminalView.vue'

const treeData = ref<TreeProps['treeData']>([])

const route = useRoute()
const router = useRouter()
const expandedKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([])
const panes = ref<{ title: string; content: string; key: string; closable?: boolean }[]>([])
const idDict = ref({})

const init = async () => {
  const res = await Host.getGroups()
  res.forEach((item) => {
    if (item.hosts.length == 0) return
    const hosts = []
    item.hosts.forEach((child) => {
      if (child.id == route.query.id) {
        selectedKeys.value = [child.id]
        expandedKeys.value = [item.id]
        panes.value.push({
          title: child.title,
          content: child.id,
          key: child.id,
        })
      }
      idDict.value[child.id] = child
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

const onSelect = (key: string[]) => {
  if (key.length == 0) {
    selectedKeys.value = [activeKey.value]
    return
  }
  selectedKeys.value = key
  const temp = panes.value.find((item) => item.content === key[0])
  if (!temp ) {
    panes.value.push({
      title: idDict.value[key[0]].title,
      content: idDict.value[key[0]].id,
      key: idDict.value[key[0]].id,
    })
    activeKey.value = key[0]
  } else {
    activeKey.value = temp.key
  }
}

init()

onBeforeUnmount(() => {
  window.name = ''
})

const getTitle = (title: string, count: number = 0): string => {
  const temp = panes.value.find((item) => item.title === (count === 0 ? title : `${title}-${count}`))
  if (!temp) {
    return count === 0 ? title : `${title}-${count}`
  } else {
    return getTitle(title, count+1)
  }
}

const onContextMenuClick = (treeKey: string, menuKey: string | number) => {
  const key = idDict.value[treeKey].id + new Date()
  switch (menuKey) {
    case 'newTab':
      panes.value.push({
        title: getTitle(idDict.value[treeKey].title),
        content: idDict.value[treeKey].id,
        key: key,
      })
      activeKey.value = key
      break
    case 'newWindow':
      window.open(`/online-terminal?id=${treeKey}`, '_blank', 'toolbar=no,location=no,directories=no,status=no,menubar=no')
      break
    case 'right':
      break
    case 'bottom':
      break
    default:
      router.push(`/online-terminal?id=${treeKey}`)
  }
}

const activeKey = ref<string>(route.query.id as string)
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

const onEdit = (targetKey: string | MouseEvent, action: string) => {
  if (action === 'add') {
    add()
  } else {
    remove(targetKey as string)
  }
}

const onExit = (id: string) => {
  remove(id)
  if (panes.value.length === 0) {
    window.opener = null
    window.open('', '_self')
    window.close()
  }
}
</script>

<template>
  <div class="absolute inset-0 overflow-hidden rounded-none flex items-center justify-center gap-0">
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
            <div class="flex items-center gap-0 pl-2">
              <img v-if="isChild" :src="Host.metaInfos.os[os]"
                   class="w-6 h-6 min-w-6 min-h-6 rounded-lg"
                   alt="logo">
              <span class="text-white m-2 capitalize">{{ title }}</span>
            </div>
            <template #overlay>
              <a-menu @click="({ key: menuKey }) => onContextMenuClick(key, menuKey)">
                <a-menu-item key="newTab">{{ $t('terminal.open.newTab') }}</a-menu-item>
<!--                <a-menu-item key="currentTab" v-if="key !== route.params.id">{{ $t('terminal.open.currentTab') }}-->
<!--                </a-menu-item>-->
                <a-menu-item key="newWindow">{{ $t('terminal.open.newWindow') }}</a-menu-item>
                <a-menu-item key="right">{{ $t('terminal.open.right') }}</a-menu-item>
                <a-menu-item key="bottom">{{ $t('terminal.open.bottom') }}</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-tree>
    </div>
    <div class="h-full w-full">
      <a-tabs class="w-full h-full bg-slate-700" v-model:activeKey="activeKey" hide-add type="editable-card" @edit="onEdit">
        <a-tab-pane class="w-full h-full bg-black" v-for="pane in panes" :key="pane.key" :tab="pane.title"
                    :closable="panes.length > 1">
          <Terminal class="w-full h-full" :uri="'/api/v1/host/terminal/' + pane.content" :focus="activeKey === pane.key" :exit="() => onExit(pane.key)" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin: 0;
}

:deep(.anticon-close),
:deep(.ant-tabs-tab-btn) {
  color: white !important;
}

:deep(.ant-tabs-tab-active) {
  background: #000 !important;
  color: white !important;
  border-radius: 0.8rem 0.8rem 0 0 !important;
  border-bottom-color: #0a0a0a !important;
  &::before {
    content: '';
    position: absolute;
    bottom: -1px;
    left: -0.8rem;
    width: 0.8rem;
    height: 0.8rem;
    background: radial-gradient(circle at 0% 0%, transparent 0.8rem, #000 0);
    animation: inherit;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    right: -0.8rem;
    width: 0.8rem;
    height: 0.8rem;
    background: radial-gradient(circle at 100% 0%, transparent 0.8rem, #000 0);
    animation: inherit;
  }
}

:deep(.ant-tabs-tab) {
  color: white !important;
  padding-top: 4px !important;
  margin-top: 4px !important;
}

:deep(:where(.css-dev-only-do-not-override-16pw25h).ant-tabs-card >.ant-tabs-nav .ant-tabs-tab, :where(.css-dev-only-do-not-override-16pw25h).ant-tabs-card >div>.ant-tabs-nav .ant-tabs-tab) {
  background: transparent;
  border: 0;
}
:deep(.ant-tabs-content) {
  height: 100%;
}

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
    animation: inherit;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -0.8rem;
    right: 0;
    width: 0.8rem;
    height: 0.8rem;
    background: radial-gradient(circle at 0% 100%, transparent 0.8rem, #000 0);
    animation: inherit;
  }
}
</style>
