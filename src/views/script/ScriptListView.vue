<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Script } from '@/views/script/Script'
import type { Pager } from '@/utils/request'
import moment from 'moment'
import TableView, { type TableColumn } from '@/components/TableView.vue'
import { ElMessageBox } from 'element-plus'

const { t } = useI18n()

const loading = ref(false)
const data = ref<Script.ScriptItem[]>([])
const currentItem = ref<Script.ScriptItem | null>(null)
const showDrawer = ref(false)
const drawerMode = ref<'edit' | 'detail' | 'add'>('edit')

const rawData = ref<Pager<Script.ScriptItem>>({
  current: 1,
  size: 25,
  total: 0
})

const formatData = () => {
  data.value = []
  rawData.value.data.forEach((item) => {
    let newItem = JSON.parse(JSON.stringify(item))
    newItem.createdAt = moment(newItem.createdAt).format('YYYY-MM-DD HH:mm:ss')
    data.value.push(newItem)
  })
}

const listScript = async () => {
  loading.value = true
  const temp = await Script.pageScript(rawData.value.current, rawData.value.size)
  temp.data?.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  rawData.value = temp
  formatData()

  loading.value = false
}

listScript()

const columns = ref<TableColumn[]>([
  {
    field: 'title',
    label: 'script.title',
    fixed: true,
    align: 'left',
    width: 150
  },
  {
    field: 'type',
    label: 'script.type',
    align: 'left',
    width: 150
  },
  {
    field: 'desc',
    label: 'script.desc',
    align: 'left',
    width: 200
  },
  {
    field: 'content',
    label: 'script.content',
    align: 'left'
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

const handleDelete = async (val: Script.ScriptItem) => {
  ElMessageBox.confirm(t('confirmDelete'), t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning'
  }).then(async () => {
    await Script.batchDeleteScript([val.id])
    await listScript()
  })
}

const handleDetail = async (val: Script.ScriptItem) => {
  currentItem.value = await Script.detailScript(val.id)
  currentItem.value.type = 'shell'
  showDrawer.value = true
  drawerMode.value = 'detail'
}

const handleEdit = async (val: Script.ScriptItem) => {
  currentItem.value = await Script.detailScript(val.id)
  currentItem.value.type = 'shell'
  showDrawer.value = true
  drawerMode.value = 'edit'
}

const handleAdd = () => {
  currentItem.value = {} as Script.ScriptItem
  currentItem.value.type = 'shell'
  showDrawer.value = true
  drawerMode.value = 'add'
}

const handleBatchDelete = async () => {
  ElMessageBox.confirm(t('confirmDelete'), t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning'
  }).then(async () => {
    await Script.batchDeleteScript(multipleSelection.value.map((item: any) => item.id))
    await listScript()
  })
}

const onPageChange = async (e) => {
  rawData.value.current = e
  await listScript()
}

const onSubmit = async () => {
  if (drawerMode.value === 'add') {
    await Script.addScript(currentItem.value)
  } else if (drawerMode.value === 'edit') {
    await Script.updateScript(currentItem.value)
  }
  showDrawer.value = false
  await listScript()
}

</script>

<template>
  <div v-loading="loading" class="flex gap-0 absolute inset-0">
    <div
      class="w-full h-full flex flex-col rounded-none shadow-2xl shadow-fuchsia-50 dark:shadow-slate-900 overflow-hidden">
      <TableView
        :data="data"
        :columns="columns"
        :selection="true"
        :operations-width="280"
        :select-change="handleSelectionChange"
        :handler-edit="handleEdit"
        :handler-delete="handleDelete"
        :handler-detail="handleDetail"
      >
        <template #header>
          <div class="flex justify-between items-center p-2">
            <!--            <div class="border-l-2 border-gray-500 pl-2 text-sm font-bold">{{ $t('navigation.schedule') }}</div>-->
            <div />
            <div class="flex items-center gap-0">
              <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
              <el-button size="small" :disabled="multipleSelection.length===0" @click="handleBatchDelete">删除
              </el-button>
            </div>
          </div>
        </template>
        <template #operations="scope">
          <el-button size="small" text bg @click="handleEdit(scope.row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button size="small" text bg type="danger" @click="handleDelete(scope.row)">
            {{ $t('table.delete') }}
          </el-button>
          <el-button size="small" text bg disabled @click="handleEdit(scope.row)">
            {{ $t('script.run') }}
          </el-button>
          <el-button size="small" text bg disabled @click="handleEdit(scope.row)">
            {{ $t('script.cron') }}
          </el-button>
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
  <el-drawer
    v-model="showDrawer"
    :title="drawerMode==='edit' ? $t('script.editTitle') : drawerMode==='add' ? $t('script.addTitle') : $t('script.detailTitle')"
    :show-close="true"
  >
    <div class="font-bold select-none">
      <el-form
        label-position="top"
        label-width="auto"
        :model="currentItem"
        size="small"
      >
        <el-form-item :label="$t('script.title')">
          <el-input v-model="currentItem.title" :disabled="drawerMode==='detail'" />
        </el-form-item>
        <el-form-item :label="$t('script.desc')">
          <el-input v-model="currentItem.desc" :disabled="drawerMode==='detail'" />
        </el-form-item>
        <el-form-item :label="$t('script.content')">
          <el-input v-model="currentItem.content" type="textarea" :disabled="drawerMode==='detail'" />
        </el-form-item>
        <el-form-item :label="$t('script.type')">
          <el-input v-model="currentItem.type" disabled />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div v-if="drawerMode=='edit' || drawerMode=='add'">
        <el-button size="small" @click="showDrawer=false">{{ $t('cancel') }}</el-button>
        <el-button size="small" type="primary" v-if="drawerMode=='edit' || drawerMode=='add'" @click="onSubmit">{{ $t('save') }}
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>

</style>