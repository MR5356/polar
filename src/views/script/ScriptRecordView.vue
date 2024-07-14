<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { Script } from '@/views/script/Script'
import type { Pager } from '@/utils/request'
import moment from 'moment'
import TableView, { type TableColumn } from '@/components/TableView.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const { t } = useI18n()
const interval = ref()

const loading = ref(false)
const data = ref<Script.ScriptRecordItem[]>([])

const rawData = ref<Pager<Script.ScriptRecordItem>>({
  current: 1,
  size: 25,
  total: 0
})

onMounted(() => {
  listRecord()
  interval.value = setInterval(listRecord, 1000)
})

onBeforeUnmount(() => {
  clearInterval(interval.value)
})

const formatData = () => {
  data.value = []
  rawData.value.data.forEach((item) => {
    let newItem = JSON.parse(JSON.stringify(item))
    newItem.createdAt = moment(newItem.createdAt).format('YYYY-MM-DD HH:mm:ss')
    newItem.spend = formatTime(moment(newItem.updatedAt).diff(newItem.createdAt, 's'))
    data.value.push(newItem)
  })
}

function formatTime(time: number) {
  const h = parseInt(String(time / 3600))
  const minute = parseInt(String((time / 60) % 60))
  const second = Math.ceil(time % 60)

  const hours = h < 10 ? '0' + h : h
  const formatSecond = second > 59 ? 59 : second
  if (hours > 0) {
    return `${hours}h${minute}m${formatSecond}s`
  }
  if (minute > 0) {
    return `${minute}m${formatSecond}s`
  }
  return `${formatSecond}s`
}

const listRecord = async () => {
  // loading.value = true
  const temp = await Script.pageRecord(rawData.value.current, rawData.value.size)
  temp.data?.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  rawData.value = temp
  formatData()

  // loading.value = false
}

const columns = ref<TableColumn[]>([
  {
    field: 'scriptTitle',
    label: 'script.title',
    fixed: true,
    align: 'left',
    width: 150
  },
  {
    field: 'status',
    label: 'script.status',
    align: 'left',
    width: 150
  },
  {
    field: 'script',
    label: 'script.content',
    align: 'left',
    width: 200
  },
  {
    field: 'params',
    label: 'script.params',
    align: 'left',
  },
  {
    field: "spend",
    label: "script.spend",
    align: "left",
    width: 150
  },
  {
    field: 'createdAt',
    label: 'script.createdAt',
    align: 'left',
    width: 200
  }
])

const multipleSelection = ref<any[]>([])

const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
}

const onPageChange = async (e) => {
  rawData.value.current = e
  await listRecord()
}

const onClickStop = async (id: string) => {
  ElMessageBox.confirm(t('confirmStop'), t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning'
  }).then(async () => {
    await Script.stopJob(id)
    ElMessage.success(t('success'))
    await listRecord()
  })
}

const showLogView = ref(false)
const logs = ref<Map<string, string[]>>(new Map())
const logInterval = ref()

async function onClickLog(id) {
  logs.value = await Script.getJobLog(id)
  showLogView.value = true
  await nextTick(() => {
    logInterval.value = setInterval(async () => {
      logs.value = await Script.getJobLog(id)
    }, 1000)
  })
}

function onCloseLogView() {
  clearInterval(logInterval.value)
  showLogView.value = false
}

</script>

<template>
  <div v-loading="loading" class="flex gap-0 absolute inset-0">
    <div
      class="w-full h-full flex flex-col rounded-none shadow-2xl shadow-fuchsia-50 dark:shadow-slate-900 overflow-hidden">
      <TableView
        :data="data"
        :columns="columns"
        :operations-width="140"
      >
        <template #operations="scope">
          <el-button size="small" text bg type="danger" @click="onClickStop(scope.row.id)" :disabled="scope.row.status !== 'running'">{{ $t('script.action.stop') }}</el-button>
          <el-button size="small" text bg @click="onClickLog(scope.row.id)">{{ $t('script.action.log') }}</el-button>
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
  </div>
  <el-dialog
    v-model="showLogView"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    :show-close="true"
    :before-close="onCloseLogView"
    class="min-w-[50%] h-[66%] overflow-y-auto"
    title="日志"
    id="logView"
  >
    <div class="flex flex-col gap-0 p-0 m-0">
      <el-collapse accordion>
        <el-collapse-item
          v-for="(log, host) in logs"
          :key="host"
          :title="host"
          :name="host"
        >
          <div v-for="(l, index) in log" :key="index" class="">
            <span class="tabular-nums"></span> {{ l }}
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-dialog>
</template>

<style scoped>

</style>