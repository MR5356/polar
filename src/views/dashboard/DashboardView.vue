<script setup lang="ts">
import { Dashboard } from '@/views/dashboard/DashboardView'
import { ref } from 'vue'
import { LinkThree } from '@icon-park/vue-next'
import NumberAnimation from 'vue-number-animation'
import numeral from 'numeral'
import moment from 'moment'

const statistics = ref<Dashboard.StatisticItem[]>([])

const init = async () => {
  statistics.value = await Dashboard.getStatistics()
}

function isNumber(value: string): boolean {
  const numberRegex = /^[0-9]+$/
  return numberRegex.test(value)
}

function theFormat(number: number) {
  if (number < 1000) {
    return numeral(number).format('0a')
  } else {
    return numeral(number).format('0.[00]a')
  }
}

init()

</script>

<template>
  <div class="bg-white bg-opacity-0 backdrop-blur-lg absolute inset-0 p-8">
    <div class="flex flex-col gap-4">
      <!-- header -->
      <div class="flex items-center justify-between">
        <div class="flex flex-col gap-2">
          <div class="text-3xl font-medium text-slate-700 dark:text-red-200">{{ $t('navigation.dashboard') }}</div>
          <div class="text-xs text-gray-500"
               v-html="moment().format('[<span class=\'text-green-500 dark:text-green-400 font-bold pr-2\'>]ddd[.</span>] YYYY-MM-DD')"></div>
        </div>
      </div>

      <!-- Welcome -->

      <!-- statistics -->
      <div class="grid grid-cols-3 gap-8">
        <div v-for="item in statistics" :key="item.name"
             class="flex items-center gap-4 bg-white dark:bg-slate-900 rounded-2xl p-4 relative">
          <div v-if="item.path" class="absolute right-4 top-4 cursor-pointer">
            <router-link :to="item.path">
              <link-three theme="outline" size="18" fill="rgb(148 163 184)" />
            </router-link>
          </div>
          <div class="w-28 h-28">
            <img :src="item.icon" alt="" />
          </div>
          <div class="flex flex-col gap-2">
<!--            <div class="text-5xl font-medium text-blue-500 dark:text-red-200">-->
<!--              {{ isNumber(item.count) ? numeral(item.count).format('0.[00]a') : item.count }}-->
<!--            </div>-->
            <div class="text-5xl font-medium text-blue-500 dark:text-red-200">
              <NumberAnimation
                v-if="isNumber(item.count)"
                :from="0"
                :to="Number(item.count)"
                :duration="1"
                :delay="0"
                :format="theFormat"
                autoplay
                easing="linear" />
              <span v-else>{{ item.count }}</span>
            </div>
            <div class="text-gray-500 dark:text-slate-400">{{ $t(item.name) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>