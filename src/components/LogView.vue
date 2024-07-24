<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

interface Log {
  id: string | number
  level: 'Info' | 'Error' | 'Debug' | 'Warn'
  message: string
}

const props = defineProps({
  logs: {
    type: Array<Log>,
    required: true
  }
})

const logViewer = ref<HTMLElement | null>(null)
const atBottom = ref(true)

const scrollToBottom = () => {
  if (logViewer.value && atBottom.value) {
    logViewer.value.scrollTop = logViewer.value.scrollHeight
  }
}
const handleVisibleChange = (startIndex, endIndex, visibleItems) => {
  if (logViewer.value) {
    const { scrollTop, scrollHeight, clientHeight } = logViewer.value
    atBottom.value = scrollTop + clientHeight >= scrollHeight - 1
    console.log(atBottom.value)
  }
}

const handleResize = () => {
  scrollToBottom()
}

watch(() => props.logs.length, scrollToBottom)

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div ref="logViewer" class="w-full h-full p-4 bg-black text-white overflow-y-auto">
    <RecycleScroller
      class=""
      :buffer="20"
      :items="logs"
      :item-size="24"
      key-field="id"
      @resize="handleResize"
      @update="handleVisibleChange"
      v-slot="{ item, index }"
    >
      <div class="text-sm">{{ index }}: {{ item.message }}</div>
    </RecycleScroller>
  </div>
</template>
<style lang="scss" scoped></style>
