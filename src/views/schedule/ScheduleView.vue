<script setup lang="ts">

import TableView, { type TableColumn } from '@/components/TableView.vue'
import { ref, watch, h } from 'vue'
import { useSystemStore } from '@/stores/system'
import { useI18n } from 'vue-i18n'
import cronstrue from 'cronstrue/i18n'
import moment from 'moment'
import { Schedule } from '@/views/schedule/ScheduleView'
import type { Pager } from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'
import withLoading from '@/utils/loading'

const systemStore = useSystemStore()
const { t } = useI18n()

const data = ref<Schedule.ScheduleItem[]>([])
const search = ref('')
const currentItem = ref<Schedule.ScheduleItem | null>(null)
const showDrawer = ref(false)
const drawerMode = ref<'edit' | 'detail'>('edit')

const executors = ref<Schedule.Executor[]>([])
const rawData = ref<Pager<Schedule.ScheduleItem>>({
  current: 1,
  size: 25,
  total: 0
})

const formatData = () => {
  data.value = []
  rawData.value.data.forEach((item) => {
    let newItem = JSON.parse(JSON.stringify(item))
    try {
      newItem.cronString = cronstrue.toString(newItem.cronString, { locale: systemStore.language })
    } catch (e) {
      console.log(e)
      newItem.cronString = t('schedule.cronError')
    }
    // newItem.enabled = t('schedule.' + newItem.enabled)
    newItem.createdAt = moment(newItem.createdAt).format('YYYY-MM-DD HH:mm:ss')
    newItem.executor = executors.value.find((item) => item.name === newItem.executor).displayName
    data.value.push(newItem)
  })
}

const listSchedule = async () => {
  await withLoading(async () => {
    executors.value = await Schedule.getExecutors()
    const temp = await Schedule.pageSchedule(rawData.value.current, rawData.value.size)
    temp.data?.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    rawData.value = temp
    formatData()
  })
}

listSchedule()

watch(() => systemStore.language, () => {
  formatData()
}, {
  deep: true
})

const columns = ref<TableColumn[]>([
  {
    field: 'title',
    label: 'schedule.title',
    fixed: true,
    align: 'left',
    width: 150,
    formatter(row, column, cellValue, index) {
      if (row.enabled) {
        return h('div', {
          class: 'flex gap-2 items-center'
        }, [
          h('span', {
            class: 'relative flex h-3 w-3 items-center justify-center'
          }, [
            h('span', {
              class: 'animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'
            }),
            h('span', {
              class: 'relative inline-flex rounded-full h-3 w-3 bg-green-500'
            })
          ]),
          h('span', { class: 'text-sm' }, cellValue)
        ])
      } else {
        return h('div', {
          class: 'flex gap-2 items-center'
        }, [
          h('span', {
            class: 'relative flex h-3 w-3'
          }, [
            h('span', {
              class: 'absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75'
            }),
            h('span', {
              class: 'relative inline-flex rounded-full h-3 w-3 bg-red-500'
            })
          ]),
          h('span', { class: 'text-sm' }, cellValue)
        ])
      }
    }
  },
  {
    field: 'cronString',
    label: 'schedule.cronString',
    align: 'left',
    width: 200
  },
  {
    field: 'executor',
    label: 'schedule.executor',
    align: 'left',
    width: 150
  },
  // {
  //   field: 'enabled',
  //   label: 'schedule.enabled',
  //   align: 'left',
  //   width: 88,
  //   formatter(row, column, cellValue, index) {
  //     if (row.enabled) {
  //       return h('span', {
  //         class: 'relative flex h-3 w-3 items-center justify-center'
  //       }, [
  //         h('span', {
  //           class: 'animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'
  //         }),
  //         h('span', {
  //           class: 'relative inline-flex rounded-full h-3 w-3 bg-green-500'
  //         })
  //       ])
  //     } else {
  //       return h('span', {
  //         class: 'relative flex h-3 w-3'
  //       }, [
  //         h('span', {
  //           class: 'absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75'
  //         }),
  //         h('span', {
  //           class: 'relative inline-flex rounded-full h-3 w-3 bg-red-500'
  //         })
  //       ])
  //     }
  //   },
  // },
  {
    field: 'desc',
    label: 'schedule.desc',
    align: 'left',
    width: 200
  },
  {
    field: 'params',
    label: 'schedule.params',
    align: 'left'
  },
  {
    field: 'createdAt',
    label: 'schedule.createdAt',
    align: 'left',
    width: 200
  }
])
const multipleSelection = ref<any[]>([])
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
}

const handleBatchDelete = async () => {
  ElMessageBox.confirm(t('confirmDelete'), t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel')
  }).then(async () => {
    await withLoading(async () => {
      await Schedule.batchDeleteSchedule(multipleSelection.value.map((item) => item.id))
      await listSchedule()
    })
  })
}

const handleBatchEnable = async (enable: boolean) => {
  await withLoading(async () => {
    await Schedule.batchSetEnabled(multipleSelection.value.map((item) => item.id), enable)
    await listSchedule()
  })
}

const handleDelete = async (val: Schedule.ScheduleItem) => {
  ElMessageBox.confirm(t('confirmDelete'), t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel')
  }).then(async () => {
    await Schedule.deleteSchedule(val.id)
    await listSchedule()
  })
}

const handleDetail = (val: Schedule.ScheduleItem) => {
  showDrawer.value = true
  drawerMode.value = 'detail'
  setCurrentItem(val)
}

const handleEdit = (val: Schedule.ScheduleItem) => {
  showDrawer.value = true
  drawerMode.value = 'edit'
  setCurrentItem(val)
}

const setCurrentItem = (val: Schedule.ScheduleItem) => {
  currentItem.value = rawData.value.data.find((item) => item.id === val.id)
}

const onPageChange = async (e) => {
  rawData.value.current = e
  await listSchedule()
}

const onUpdateSchedule = async () => {
  await withLoading(async () => {
    try {
      cronstrue.toString(currentItem.value.cronString, { locale: systemStore.language })
    } catch (e) {
      console.log(e)
      ElMessage.error(t('schedule.cronError'))
      return
    }
    await Schedule.updateSchedule(currentItem.value).finally(() => {
    })
    showDrawer.value = false
    await listSchedule()
  })
}

const onSearch = () => {
  console.log(search.value)
}
</script>

<template>
  <div class="flex gap-0 absolute inset-0">
    <div
      class="w-full h-full flex flex-col rounded-none shadow-2xl shadow-fuchsia-50 dark:shadow-slate-900 overflow-hidden">
      <TableView
        :data="data"
        :columns="columns"
        :selection="true"
        :select-change="handleSelectionChange"
        :handler-delete="handleDelete"
        :handler-edit="handleEdit"
        :handler-detail="handleDetail"
        v-model:search="search"
      >
        <template #header>
          <div class="flex justify-between items-center p-2">
<!--            <div class="border-l-2 border-gray-500 pl-2 text-sm font-bold">{{ $t('navigation.schedule') }}</div>-->
            <div />
            <div class="flex items-center gap-0">
              <el-button type="primary" size="small" :disabled="multipleSelection.length===0" @click="handleBatchEnable(true)">启用</el-button>
              <el-button size="small" :disabled="multipleSelection.length===0" @click="handleBatchEnable(false)">禁用</el-button>
              <el-button size="small" :disabled="multipleSelection.length===0" @click="handleBatchDelete">删除</el-button>
            </div>
          </div>
        </template>
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
    <el-drawer v-model="showDrawer" :title="drawerMode==='edit' ? $t('schedule.editTitle') : $t('schedule.detailTitle')"
               :show-close="true">
      <div class="font-bold select-none">
        <el-form
          label-position="right"
          label-width="auto"
          :model="currentItem"
          size="small"
        >
          <el-form-item :label="$t('schedule.title')">
            <el-input v-model="currentItem.title" :disabled="drawerMode==='detail'" />
          </el-form-item>
          <el-form-item :label="$t('schedule.desc')">
            <el-input v-model="currentItem.desc" :disabled="drawerMode==='detail'" />
          </el-form-item>
          <el-form-item :label="$t('schedule.cronString')">
            <el-input v-model="currentItem.cronString" :disabled="drawerMode==='detail'" />
          </el-form-item>
          <el-form-item :label="$t('schedule.executor')">
            <el-select
              v-model="currentItem.executor"
              :disabled="drawerMode==='detail'"
            >
              <el-option
                v-for="item in executors"
                :key="item.name"
                :label="item.displayName"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('schedule.enabled')">
            <el-switch v-model="currentItem.enabled" :disabled="drawerMode==='detail'" />
          </el-form-item>
          <el-form-item :label="$t('schedule.params')">
            <el-input type="textarea" :rows="5" v-model="currentItem.params" :disabled="drawerMode==='detail'" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div v-if="drawerMode=='edit'">
          <el-button size="small" @click="showDrawer=false">{{ $t('cancel') }}</el-button>
          <el-button size="small" type="primary" v-if="drawerMode=='edit'" @click="onUpdateSchedule">{{ $t('save') }}
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped>
:deep(.el-drawer__header) {
  margin-bottom: 0;
}
</style>