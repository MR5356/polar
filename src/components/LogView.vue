<script setup lang="ts">
import { ref } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'

const items = ref([
  { id: 1, message: 'Log message 1' },
  { id: 2, message: 'Log message 2' }
])

for (let i = 0; i < 100; i++) {
  items.value.push({ id: i + 3, message: `aaaa: ${i}` })
}
</script>

<template>
    <RecycleScroller class="w-full h-full p-4 bg-black text-white" :items="items" :item-size="28" key-field="id">
      <template #default="{ item, index }">
        <div class="font-bold">
            {{ index }}: {{ item.message }}
        </div>
      </template>
    </RecycleScroller>
</template>
<style lang="scss" scoped></style>
