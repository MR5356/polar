<script setup lang="ts">
import { ref, h } from 'vue'
import withLoading from '@/utils/loading'
import { Pipeline } from '@/views/pipeline/PipelineListView'
import TableView, { TableColumn } from '@/components/TableView.vue'
import moment from 'moment'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { Schedule } from '@/views/schedule/ScheduleView'
import { useI18n } from 'vue-i18n'

const rawData = ref<Pipeline.PipelineItem[]>([])
const data = ref<Pipeline.PipelineItem[]>([])
const { t } = useI18n()

const router = useRouter()

const listPipeline = async () => {
  await withLoading(async () => {
    rawData.value = await Pipeline.listPipeline()
    data.value = rawData.value
  })
}

listPipeline()

const columns = ref<Array<TableColumn>>([
  {
    field: 'title',
    label: 'pipeline.table.title',
    fixed: true,
    align: 'left',
    width: 200,
    formatter(row, column, cellValue, index) {
      return h('div', {
        class: 'text-blue-500 cursor-pointer',
        onClick: () => {
          router.push({
            name: 'pipelineDetail',
            params: {
              id: row.id
            }
          })
        }
      }, cellValue)
    }
  },
  {
    field: 'owner',
    label: 'pipeline.table.owner',
    align: 'left',
    width: 150
  },
  {
    field: 'nodes',
    label: 'pipeline.table.preview',
    align: 'left',
    formatter(row, column, cellValue, index) {
      // return h(WorkFlowView, {
      //   data: {
      //     nodes: column.nodes,
      //     edges: column.edges
      //   },
      //   onClickNode: (e) => {
      //     console.log(e)}
      // }, () => {})
      return `${row.nodes.length} nodes with ${row.edges.length} edges`
    }
  },
  {
    field: 'createdAt',
    label: 'pipeline.table.createdAt',
    align: 'left',
    width: 180,
    formatter(row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    field: 'updatedAt',
    label: 'pipeline.table.updatedAt',
    align: 'left',
    width: 180,
    formatter(row, column, cellValue, index) {
      return moment(cellValue).fromNow()
    }
  }
])

const multipleSelection = ref<Pipeline.PipelineItem[]>([])
const handleSelectionChange = (val: Pipeline.PipelineItem[]) => {
  multipleSelection.value = val
}

const handleBatchDelete = async () => {
  ElMessageBox.confirm(t('confirmDelete'), t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel')
  }).then(async () => {
    await withLoading(async () => {
      // await Schedule.batchDeleteSchedule(multipleSelection.value.map((item) => item.id))
      await listPipeline()
    })
  })
}

const handleUpdateWorkflow = (item: Pipeline.PipelineItem) => {
  router.push({
    name: 'pipelineNew',
    query: {
      id: item?.id
    },
  })
}

const handleDelete = (v: Pipeline.PipelineItem) => {
  ElMessageBox.confirm(t('confirmDelete'), t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel')
  }).then(async () => {
    await withLoading(async () => {
      await Pipeline.deletePipeline(v.id)
      await listPipeline()
    })
  })
}

</script>

<template>
  <div class="flex gap-0 h-[100vh]">
    <div
      class="w-full h-full flex flex-col rounded-none shadow-2xl shadow-fuchsia-50 dark:shadow-slate-900 overflow-hidden">
      <TableView
        :data="data"
        :columns="columns"
        :selection="true"
        :handler-delete="handleDelete"
        :handler-edit="handleUpdateWorkflow"
        :select-change="handleSelectionChange"
      >
        <template #header>
          <div class="flex justify-between items-center p-2">
            <!--            <div class="border-l-2 border-gray-500 pl-2 text-sm font-bold">{{ $t('navigation.schedule') }}</div>-->
            <div />
            <div class="flex items-center gap-0">
              <el-button type="primary" size="small" @click="handleUpdateWorkflow(null)">新增
              </el-button>
              <el-button size="small" :disabled="multipleSelection.length===0" @click="handleBatchDelete">删除
              </el-button>
            </div>
          </div>
        </template>
      </TableView>
    </div>
  </div>
</template>

<style scoped>

</style>