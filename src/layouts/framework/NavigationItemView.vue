<script setup lang="ts">
import ColorView from '@/components/ColorView.vue'
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
  <ColorView
    @click="onClickNavigation(item)"
    :custom-class="'transition duration-700 ease-in-out cursor-pointer ' + (currentPath === item.path && (!haveChildren(item)) ? 'bg-sky-100 dark:bg-sky-400 dark:bg-opacity-20 font-bold text-black dark:text-white' : '')">
    <div class="flex gap-3 items-center p-1">
      <img :src="getIcon(item)" v-if="!isChildren" alt="icon" class="w-[1.125rem] h-[1.125rem]" />
      <div>
        <div>{{ $t(item.title) }}</div>
      </div>
    </div>
  </ColorView>

  <div v-if="item.expand" class="pl-7">
    <div v-for="child in item.children" :key="child.title">
      <NavigationItemView :item="child" :is-children="true" />
    </div>
  </div>
</template>

<style scoped>

</style>