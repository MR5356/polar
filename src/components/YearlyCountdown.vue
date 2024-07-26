<script setup lang="ts">
import { ref } from 'vue'
import moment from 'moment'
import useTimer from '@/hooks/useTimer'

enum Status {
  PASSED = 'bg-cyan-200',
  CURRENT = 'bg-cyan-400 animate-bounce',
  WORK = 'bg-green-200',
  SLEEP = 'bg-blue-200',
  COMMUTE = 'bg-purple-200',
  SELF = 'bg-sky-100'
}

const colors = ref([])

function normalization() {
  const totalSlots = 100
  const colorArray = new Array(totalSlots).fill(Status.SELF)

  const now = moment()
  const dayOfYear = now.dayOfYear()
  const totalDaysInYear = now.isLeapYear() ? 366 : 365
  const daysLeftInYear = totalDaysInYear - dayOfYear

  let weekendsCount = 0
  for (let i = 1; i <= daysLeftInYear; i++) {
    const futureDate = moment().add(i, 'days')
    const dayOfWeek = futureDate.day() // 0: Sunday, 6: Saturday
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendsCount++
    }
  }

  const weekDaysOfHours = (daysLeftInYear - weekendsCount) / 24 * 8
  const sleepDaysOfHours = daysLeftInYear / 24 * 8
  const commutingDaysOfHours = weekDaysOfHours / 24 * 2

  let currentIndex = 0
  for (let i = 0; i < 400; i++) {
    if (currentIndex < Number((dayOfYear / totalDaysInYear * totalSlots).toFixed(0))) {
      colorArray[currentIndex] = Status.PASSED
    } else if (currentIndex === Number((dayOfYear / totalDaysInYear * totalSlots).toFixed(0))) {
      colorArray[currentIndex] = Status.CURRENT
    } else if (currentIndex < (dayOfYear + weekDaysOfHours) / totalDaysInYear * totalSlots) {
      colorArray[currentIndex] = Status.WORK
    } 
    // else if (currentIndex < (dayOfYear + weekDaysOfHours + commutingDaysOfHours) / totalDaysInYear * totalSlots) {
    //   colorArray[currentIndex] = Status.COMMUTE
    // } 
    else if (currentIndex < (dayOfYear + weekDaysOfHours + commutingDaysOfHours + sleepDaysOfHours) / totalDaysInYear * totalSlots) {
      colorArray[currentIndex] = Status.SLEEP
    }
    currentIndex++
  }
  colors.value = colorArray
}

useTimer(normalization, {interval: 1000 * 60})
</script>

<template>
  <el-popover
    placement="top-start"
    :width="500"
    trigger="hover"
  >
    <template #reference>
      <div class="bg-white dark:bg-slate-900 rounded-lg w-full grid grid-cols-20 gap-1 p-4">
        <template v-for="(color, index) in colors" :key="index">
          <div class="w-full aspect-square col-span-1" :class="color"></div>
        </template>
      </div>
    </template>
    <div class="flex flex-col gap-2">
      <div class="flex gap-2">
        <div class="w-4 min-w-4 aspect-square" :class="Status.PASSED"></div>
        <div>{{ $t('component.yearlyCountdown.passed') }}</div>
      </div>
      <div class="flex gap-2">
        <div class="w-4 min-w-4 aspect-square" :class="Status.CURRENT"></div>
        <div>{{ $t('component.yearlyCountdown.current') }}</div>
      </div>
      <div class="flex gap-2">
        <div class="w-4 min-w-4 aspect-square" :class="Status.WORK"></div>
        <div>{{ $t('component.yearlyCountdown.work') }}</div>
      </div>
      <!-- <div class="flex gap-2">
        <div class="w-4 min-w-4 aspect-square" :class="Status.COMMUTE"></div>
        <div>{{ $t('component.yearlyCountdown.commute') }}</div>
      </div> -->
      <div class="flex gap-2">
        <div class="w-4 min-w-4 aspect-square" :class="Status.SLEEP"></div>
        <div>{{ $t('component.yearlyCountdown.sleep') }}</div>
      </div>
      <div class="flex gap-2">
        <div class="w-4 min-w-4 aspect-square" :class="Status.SELF"></div>
        <div>{{ $t('component.yearlyCountdown.self') }}</div>
      </div>
    </div>
  </el-popover>
</template>

<style scoped>
.grid-cols-20 {
  grid-template-columns: repeat(20, minmax(0, 1fr));
}
</style>