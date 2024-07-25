<script setup lang="ts">
import { ref, watch } from 'vue'

const colors = ref([])
const props = defineProps({
  percent: {
    type: Array<number>,
    required: true
  },
  color: {
    type: Array<string>,
    required: false,
    default: () => ['bg-red-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500']
  }
})

function normalization() {
  const totalSlots = 50
  const colorArray = new Array(totalSlots).fill('bg-gray-200') // 初始化50个元素的数组，默认值为空字符串
  let currentIndex = 0

  // 遍历百分比数组，按比例填充颜色
  props.percent.forEach((percent, i) => {
    const slots = Math.round(percent * totalSlots) // 计算当前颜色应该填充的槽位数量
    for (let j = 0; j < slots; j++) {
      if (currentIndex < totalSlots) {
        colorArray[currentIndex] = props.color[i] || '' // 填充颜色
        currentIndex++
      }
    }
  })
  colors.value = colorArray
}

watch(
  () => [props.percent, props.color],
  normalization,
  { deep: true } // 深度监听数组的变化
)

normalization()
</script>

<template>
  <div class="w-full flex flex-nowrap justify-between gap-1">
    <div v-for="(color, index) in colors" :key="index" class="ease-in-out duration-300 transition-colors rounded-full flex-auto h-4"
         :class="color"></div>
  </div>
</template>

<style scoped>
</style>