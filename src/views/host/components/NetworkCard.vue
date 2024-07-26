<script setup lang="ts">
import numeral from 'numeral'
import { Wifi, UpTwo, DownTwo } from '@icon-park/vue-next'

interface NetworkInfo {
  name: string
  type: string
  bytes_rec: number
  bytes_sent: number
  speed_rec: number
  speed_sent: number
}

defineProps({
  data: {
    type: Array<NetworkInfo>,
    required: true
  }
})
</script>

<template>
  <div class="bg-white rounded-lg flex flex-col gap-2 min-w-[420px] h-fit text-sm select-none">
    <template v-for="(item, index) in data" :key="index">
      <div class="flex flex-col p-4 gap-2">
        <div class="text-xs font-medium flex items-center gap-2">
          <wifi theme="outline" size="16" fill="rgb(100 116 139)" />
          <div>{{ item.name }}</div>
        </div>
        <div class="grid grid-cols-3">
          <div class="flex flex-col items-start gap-1">
            <div class="text-slate-500">{{ $t('component.networkCard.upload') }}</div>
            <div class="text-xs font-medium">{{ numeral(item.bytes_sent).format('0b') }}</div>
          </div>
          <div class="flex flex-col items-center gap-1">
            <div class="text-slate-500">{{ $t('component.networkCard.download') }}</div>
            <div class="text-xs font-medium">{{ numeral(item.bytes_rec).format('0b') }}</div>
          </div>
          <div class="flex flex-col items-end gap-1">
            <div class="font-bold text-xs text-slate-500 flex gap-1 items-center">
              <div>{{ numeral(item.speed_sent).format('0b') }}&nbsp;/&nbsp;s</div>
              <up-two theme="filled" size="14" fill="rgb(252 211 77)" />
            </div>
            <div class="font-bold text-xs text-slate-500 flex gap-1 items-center">
              <div>{{ numeral(item.speed_rec).format('0b') }}&nbsp;/&nbsp;s</div>
              <down-two theme="filled" size="14" fill="rgb(134 239 172)" />
            </div>
          </div>
        </div>
      </div>
      <div class="mx-4" :class="index !== data.length - 1 ? 'border-b-[1px]' : ''"></div>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
