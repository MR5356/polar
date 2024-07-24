<script setup lang="ts">
import { ref, h } from 'vue'
import TableView, { type TableColumn } from '@/components/TableView.vue'
import { Schedule } from '@/views/schedule/ScheduleView'
import type { Pager } from '@/utils/request'
import moment from 'moment/moment'
import { useI18n } from 'vue-i18n'
import { Loading } from '@icon-park/vue-next'
import useTimer from '@/hooks/useTimer'

const { t } = useI18n()

const data = ref<Schedule.ScheduleRecordItem[]>([])
const executors = ref<Schedule.Executor[]>([])
const rawData = ref<Pager<Schedule.ScheduleRecordItem>>({
  current: 1,
  size: 25,
  total: 0
})
const columns = ref<TableColumn[]>([
  {
    field: 'title',
    label: 'schedule.title',
    fixed: true,
    align: 'left',
    width: 150
  },
  {
    field: 'executor',
    label: 'schedule.executor',
    align: 'left',
    width: 150
  },
  {
    field: 'status',
    label: 'schedule.status',
    align: 'left',
    width: 150,
    formatter(row, column, cellValue, index) {
      if (row.status === 'success') {
        return h(
          'div',
          {
            class: 'flex gap-2 items-center'
          },
          [
            h(
              'span',
              {
                class: 'relative flex h-3 w-3 items-center justify-center'
              },
              [
                h('span', {
                  class: 'absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'
                }),
                h('span', {
                  class: 'relative inline-flex rounded-full h-3 w-3 bg-green-500'
                })
              ]
            ),
            h('span', { class: 'text-sm' }, t('schedule.statusSuccess'))
          ]
        )
      } else if (row.status === 'running') {
        return h(
          'div',
          {
            class: 'flex gap-2 items-center'
          },
          [
            h(Loading, {
              class: 'animate-spin',
              fill: '#2e99e5'
            }),
            h('span', { class: 'text-sm' }, t('schedule.statusRunning'))
          ]
        )
      } else {
        return h(
          'div',
          {
            class: 'flex gap-2 items-center'
          },
          [
            h(
              'span',
              {
                class: 'relative flex h-3 w-3'
              },
              [
                h('span', {
                  class: 'absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75'
                }),
                h('span', {
                  class: 'relative inline-flex rounded-full h-3 w-3 bg-red-500'
                })
              ]
            ),
            h('span', { class: 'text-sm' }, t('schedule.statusError'))
          ]
        )
      }
    }
  },
  {
    field: 'params',
    label: 'schedule.params',
    align: 'left'
  },
  {
    field: 'costTime',
    label: 'schedule.costTime',
    align: 'left',
    width: 100
  },
  {
    field: 'createdAt',
    label: 'schedule.execAt',
    align: 'left',
    width: 200
  },
  {
    field: 'updatedAt',
    label: 'schedule.endAt',
    align: 'left',
    width: 200,
    formatter(row, column, cellValue, index) {
      if (row.status === 'success') {
        return t(cellValue)
      } else {
        return '-'
      }
    }
  }
])

const formatData = () => {
  data.value = []
  rawData.value.data.forEach((item) => {
    let newItem = JSON.parse(JSON.stringify(item))

    // newItem.enabled = t('schedule.' + newItem.enabled)
    newItem.costTime =
      (newItem.createdAt === newItem.updatedAt
        ? moment().diff(moment(newItem.createdAt), 'seconds')
        : moment(newItem.updatedAt).diff(moment(newItem.createdAt), 'seconds')
      ).toLocaleString() + 's'
    newItem.createdAt = moment(newItem.createdAt).format('YYYY-MM-DD HH:mm:ss')
    newItem.updatedAt = moment(newItem.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    // newItem.costTime = (moment(newItem.updatedAt).diff(moment(newItem.createdAt), 'seconds')).toLocaleString() + 's'
    newItem.executor =
      executors.value.find((item) => item.name === newItem.executor)?.displayName ?? t('unknown')
    data.value.push(newItem)
  })
}

const listScheduleRecord = async (loading: boolean = true) => {
  executors.value = await Schedule.getExecutors()
  rawData.value = await Schedule.pageScheduleRecord(rawData.value.current, rawData.value.size)
  formatData()
}

const { result, isFirstLoading } = useTimer(async () => {
  executors.value = await Schedule.getExecutors()
  rawData.value = await Schedule.pageScheduleRecord(rawData.value.current, rawData.value.size)
  formatData()
})

const onPageChange = async (e) => {
  rawData.value.current = e
  await listScheduleRecord()
}
</script>

<template>
  <div class="flex gap-0 absolute inset-0" v-loading="isFirstLoading">
    <div
      class="w-full h-full flex flex-col rounded-none shadow-2xl shadow-fuchsia-50 dark:shadow-slate-900 overflow-hidden"
    >
      <TableView :data="data" :columns="columns">
        <template #footer>
          <el-pagination
            layout="prev, pager, next"
            :hide-on-single-page="true"
            :total="rawData.total"
            :page-size="rawData.size"
            @change="onPageChange"
          />
        </template>
      </TableView>
    </div>
  </div>
</template>

<style scoped></style>
