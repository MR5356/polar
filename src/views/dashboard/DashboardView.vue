<script setup lang="ts">
import { Dashboard } from '@/views/dashboard/DashboardView'
import { ref } from 'vue'
import { LinkThree } from '@icon-park/vue-next'
import NumberAnimation from 'vue-number-animation'
import numeral from 'numeral'
import EmptyImage from '@/assets/coding.svg'
import TimeClock from '@/components/TimeClock.vue'
import HealthStatisticsView from '@/views/health/HealthStatisticsChartsView.vue'
import VersionView from '@/views/dashboard/VersionView.vue'

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
  <div class="bg-white bg-opacity-0 backdrop-blur-lg absolute inset-0 p-4">
    <div class="flex flex-col gap-4">
      <!-- header -->
      <!--      <div class="flex items-center justify-between">-->
      <!--        <div class="flex flex-col gap-2">-->
      <!--          <div class="text-3xl font-medium text-slate-700 dark:text-slate-200">{{ $t('navigation.dashboard') }}</div>-->
      <!--          <div class="text-xs text-gray-500"-->
      <!--               v-html="moment().format('[<span class=\'text-green-500 dark:text-green-400 font-bold pr-2\'>]ddd[.</span>] YYYY-MM-DD')"></div>-->
      <!--        </div>-->
      <!--      </div>-->

      <!-- Welcome -->

      <div class="flex gap-4">
        <!-- statistics -->
        <div class="w-3/4 flex flex-col gap-4 select-none h-fit">
          <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-sky-100">
            <div class="p-4 font-bold">健康检查统计</div>
            <HealthStatisticsView />
          </div>
          <div class="grid grid-cols-3 gap-4 ">
            <template v-for="item in statistics" :key="item.name">
              <router-link :to="item.path">
                <div class="flex items-center gap-4 bg-white dark:bg-slate-900 rounded-2xl p-2 relative">
                  <link-three class="absolute top-2 right-2" v-if="item.path" theme="outline" size="18"
                              fill="rgb(148 163 184)" />
                  <div class="w-20 h-20">
                    <img :src="Dashboard.getIcon(item.icon)" alt="" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <div class="text-3xl font-medium text-blue-500 dark:text-slate-200">
                      <NumberAnimation
                        v-if="isNumber(item.count)"
                        :from="0"
                        :to="Number(item.count)"
                        :duration="1"
                        :delay="0"
                        :format="theFormat"
                        autoplay
                        easing="linear" />
                      <span v-else>
                    <span v-if="item.count.startsWith('i18n://')"
                          class="text-3xl">{{ $t(item.count.replaceAll('i18n://', '')) }}</span>
                    <span v-else>{{ item.count }}</span>
                  </span>
                    </div>
                    <div class="text-gray-500 dark:text-slate-400">{{ $t(item.name) }}</div>
                  </div>
                </div>
              </router-link>
            </template>
          </div>
        </div>
        <div class="w-1/4 h-fit">
          <div class="grid grid-cols-1 gap-4">
            <TimeClock />
            <div class="bg-white dark:bg-slate-900 rounded-2xl p-2">
              <el-empty :description="$t('welcome')" :image-size="240" :image="EmptyImage" />
            </div>
            <VersionView />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>