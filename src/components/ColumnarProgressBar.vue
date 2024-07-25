<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :width="`${zT.zTW}`"
    :height="`${zT.zTH}px`"
    fill="transparent"
  >
    <defs>
      <!-- 下部柱体 -->
      <linearGradient
        id="myLinearGradient1"
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
        spreadMethod="pad"
      >
        <stop offset="0%" stop-color="rgb(220 252 231)" stop-opacity="0.5" />
        <stop offset="100%" stop-color="rgb(187 247 208)" stop-opacity="1" />
      </linearGradient>
      <!-- 上部柱体 -->
      <linearGradient
        id="myLinearGradient3"
        x1="0%"
        y1="0%"
        x2="60%"
        y2="100%"
        spreadMethod="pad"
      >
        <stop offset="0%" stop-color="rgb(226 232 240)" stop-opacity="0.2" />
        <stop offset="75%" stop-color="rgb(148 163 184)" stop-opacity="0.3" />
        <stop offset="100%" stop-color="rgb(203 213 225)" stop-opacity="0.5" />
      </linearGradient>
      <!-- 顶部椭圆 -->
      <linearGradient
        id="myLinearGradient2"
        x1="0%"
        y1="0%"
        x2="60%"
        y2="100%"
        spreadMethod="pad"
      >
        <stop offset="0%" stop-color="rgb(129,157,190)" stop-opacity="0.2" />
        <stop offset="100%" stop-color="rgb(89,130,196)" stop-opacity="0.5" />
      </linearGradient>
      <linearGradient id="gradient">
        <stop offset="0%" stop-color="#FFCF02" />
        <stop offset="100%" stop-color="#FF7352" />
      </linearGradient>
    </defs>

    <!-- 下部柱体 -->
    <path :d="xbzt" style="fill: url(#myLinearGradient1)" />
    <!-- 上部柱体 -->
    <path :d="sbzt" style="fill: url(#myLinearGradient3)" />
    <!-- 顶部椭圆 -->
    <path :d="dbty" style="fill: url(#myLinearGradient2)" />

    <text
      x="50%"
      :y="`${zT.zTH + 12}`"
      alignment-baseline="middle"
      text-anchor="middle"
      fill="#333"
      font-size="10"
    >
      {{ label }}
    </text>
  </svg>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const fData = defineProps({
  scale: {
    type: Number,
    default: 0
  },
  label: {
    type: String,
    default: '比率'
  }
})

// 柱体快高比例
const zTWHP = 150 / 230
const width = 28

// 柱体宽度
const zT = reactive({
  zTW: width,
  zTH: width / zTWHP,
  zTRX: width / 2,
  zTRY: 12 / 50 * width
})
const scale = fData.scale
// 柱体进度高度 52.6是调试出来的
const progress = (width / 100) * scale

const dbty = ref(`
      M${0} ${zT.zTRY}
      A${zT.zTRX} ${zT.zTRY}, 0, 0, 0, ${zT.zTW} ${zT.zTRY}
      A${zT.zTRX} ${zT.zTRY}, 0, 0, 0, ${0} ${zT.zTRY}`)
const sbzt = ref(`
      M${0} ${zT.zTH - zT.zTRY - progress}
      A${zT.zTRX} ${zT.zTRY}, 0, 0, 0, ${zT.zTW} ${zT.zTH - zT.zTRY - progress}
      L${zT.zTW}, ${zT.zTRY}
      A${zT.zTRX} ${zT.zTRY}, 0, 0, 1, ${0} ${zT.zTRY}`)
// 下部柱体
const xbzt = ref(`
      M${0} ${zT.zTH - zT.zTRY}
      A${zT.zTRX} ${zT.zTRY}, 0, 0, 0, ${zT.zTW} ${zT.zTH - zT.zTRY}
      L${zT.zTW}, ${zT.zTH - zT.zTRY - progress}
      A${zT.zTRX} ${zT.zTRY}, 0, 0, 0, ${0} ${zT.zTH - zT.zTRY - progress}`)

function normalization() {
  const scale = fData.scale
  // 柱体进度高度 52.6是调试出来的
  const progress = (52.6 / 100) * scale

// 顶部椭圆
  dbty.value = `
      M${0} ${zT.zTRY}
      A${zT.zTRX} ${zT.zTRY}, 0, 0, 0, ${zT.zTW} ${zT.zTRY}
      A${zT.zTRX} ${zT.zTRY}, 0, 0, 0, ${0} ${zT.zTRY}`
// 上部柱体
  sbzt.value = `
      M${0} ${zT.zTH - zT.zTRY - progress}
      A${zT.zTRX} ${zT.zTRY}, 0, 0, 0, ${zT.zTW} ${zT.zTH - zT.zTRY - progress}
      L${zT.zTW}, ${zT.zTRY}
      A${zT.zTRX} ${zT.zTRY}, 0, 0, 1, ${0} ${zT.zTRY}`
// 下部柱体
  xbzt.value = `
      M${0} ${zT.zTH - zT.zTRY}
      A${zT.zTRX} ${zT.zTRY}, 0, 0, 0, ${zT.zTW} ${zT.zTH - zT.zTRY}
      L${zT.zTW}, ${zT.zTH - zT.zTRY - progress}
      A${zT.zTRX} ${zT.zTRY}, 0, 0, 0, ${0} ${zT.zTH - zT.zTRY - progress}`
}

watch(() => fData.scale, () => {
  normalization()
}, { deep: true })
</script>
<style scoped lang="scss"></style>