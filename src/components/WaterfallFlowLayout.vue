<script setup lang="ts">
import { type VNode } from 'vue'

defineProps({
  nodes: {
    type: Array<VNode>,
    required: true
  }
})

const calcRows = () => {
  const masonry = document.querySelector('.masonry')
  const items = masonry.querySelectorAll('.item')
  // 获取当前列数
  const cols = getComputedStyle(masonry).gridTemplateColumns.split(' ').length
  items.forEach((item, index) => {
    // 给需要上下间隔的元素增加上间隔（每列第一个元素无需上间隔）
    const gapRows = index >= cols ? 8 : 0
    // 根据元素高度设置元素的需占行数
    const rows = Math.ceil(item.clientHeight / 2) + gapRows
    item.style.gridRowEnd = `span ${rows}`
  })
}

window.addEventListener('resize', calcRows)
</script>

<template>
  <div class="w-full h-full">
    <div class="masonry">
      <template v-for="(node, index) in nodes" :key="index">
        <component class="item" :is="node"></component>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.masonry {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 0 60px;
  grid-auto-rows: min-content;
  align-items: start;
}
.item {
  background: #f8f8fa;
  display: flex;
  justify-content: center;
  align-items: center;
}
@media (min-width: 1280px) and (max-width: 1920px) {
  .masonry {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 768px) and (max-width: 1280px) {
  .masonry {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .masonry {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
