<script setup lang="ts">
import { SystemModels } from '@/layouts/SystemModels'
import { useRouter } from 'vue-router'
import { ref, watchEffect } from 'vue'

const router = useRouter()
const currentPath = ref(router.currentRoute.value.fullPath)

watchEffect(() => {
  currentPath.value = router.currentRoute.value.fullPath
})

const props = defineProps({
  item: {
    type: Object as () => SystemModels.Navigation,
    required: true
  },
  isChildren: {
    type: Boolean,
    default: false
  }
})

const item = ref(props.item)

const find = item.value.children?.find((i) => i.path === currentPath.value)
if (find) {
  item.value.expand = true
}

const haveChildren = (item: SystemModels.Navigation) => {
  return item.children && item.children.length > 0
}

const getIcon = (item: SystemModels.Navigation) => {
  if (currentPath.value === item.path) {
    return item.selectedIcon ?? item.icon
  } else {
    return item.icon
  }
}

const onClickNavigation = (item: SystemModels.Navigation) => {
  if (haveChildren(item)) {
    item.expand = !item.expand
    return
  }
  router.push(item.path!)
}
</script>

<template>
  <div
    @click="onClickNavigation(item)"
    :class="'p-2 item cursor-pointer ' + (currentPath === item.path && (!haveChildren(item)) ? 'item-selected dark:bg-opacity-20 font-bold text-black dark:text-white' : '')">
    <div class="flex gap-3 items-center p-1">
      <img :src="getIcon(item)" v-if="!isChildren" alt="icon" class="w-[1.125rem] h-[1.125rem]" />
      <div>
        <div>{{ $t(item.title) }}</div>
      </div>
    </div>
  </div>

  <div v-if="item.expand" class="pl-7 flex flex-col gap-2">
    <div v-for="child in item.children" :key="child.title">
      <NavigationItemView :item="child" :is-children="true" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item {
  &:hover {
    background: #f8fafc;
    border-radius: 0.8rem;
    margin-right: 0.5rem;
  }
  .dark & {
    &:hover {
      background: #334155;
      border-radius: 0.8rem;
      margin-right: 0.5rem;
    }
  }
}

.item-selected {
  position: relative;
  background: #f8fafc;
  border-radius: 0.8rem 0 0 0.8rem;

  &:hover {
    border-radius: 0.8rem 0 0 0.8rem;
    margin-right: 0;
  }

  &::before {
    content: '';
    position: absolute;
    top: -0.8rem;
    right: 0;
    width: 0.8rem;
    height: 0.8rem;
    background: radial-gradient(circle at 0% 0%, transparent 0.8rem, #f8fafc 0);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -0.8rem;
    right: 0;
    width: 0.8rem;
    height: 0.8rem;
    background: radial-gradient(circle at 0% 100%, transparent 0.8rem, #f8fafc 0);
  }
}
.item-selected:is(.dark *) {
  position: relative;
  background: #334155;
  border-radius: 0.8rem 0 0 0.8rem;

  &:hover {
    border-radius: 0.8rem 0 0 0.8rem;
    margin-right: 0;
  }

  &::before {
    content: '';
    position: absolute;
    top: -0.8rem;
    right: 0;
    width: 0.8rem;
    height: 0.8rem;
    background: radial-gradient(circle at 0% 0%, transparent 0.8rem, #334155 0);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -0.8rem;
    right: 0;
    width: 0.8rem;
    height: 0.8rem;
    background: radial-gradient(circle at 0% 100%, transparent 0.8rem, #334155 0);
  }
}
</style>