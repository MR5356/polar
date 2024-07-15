<script setup lang="ts">
import { ref, h, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { Script } from '@/views/script/Script'
import { Host } from '@/views/host/HostIndexView'
import type { Pager } from '@/utils/request'
import moment from 'moment'
import TableView, { type TableColumn } from '@/components/TableView.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'
import type { EditorConfiguration } from 'codemirror'
import type { CmComponentRef } from 'codemirror-editor-vue3'
import 'codemirror/mode/shell/shell'

const { t } = useI18n()

const loading = ref(false)
const data = ref<Script.ScriptItem[]>([])
const currentItem = ref<Script.ScriptItem | null>(null)
const showDrawer = ref(false)
const drawerMode = ref<'edit' | 'detail' | 'add'>('edit')

const showRunScript = ref(false)
const currentScript = ref<Script.ScriptItem | null>(null)
const params = ref('')
const isCron = ref(false)

const runScript = ref({
  scriptId: '',
  params: '',
  hostIds: [],
  type: 'machine',
  machineGroupId: null,
  ms: [],
  mgs: [],
  cron: '',
  title: '',
  desc: ''
})

const cmOptions: EditorConfiguration = {
  mode: "text/x-sh",
  lineNumbers: true,
  autofocus: true,
}
const intervalCodeMirror = ref()
const cmRef = ref<CmComponentRef>()

onMounted(() => {
  intervalCodeMirror.value = setInterval(cmRef.value?.refresh, 500)
})

onBeforeUnmount(() => {
  clearInterval(intervalCodeMirror.value)
})


function onRunScriptTabChange(e) {
  if (e === 'machine') {
    runScript.value.machineGroupId = null
  } else {
    runScript.value.hostIds = []
  }
}

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
    width: 150,
    formatter(row, column, cellValue, index) {
      return h('a', {
        class: 'text-blue-500 cursor-pointer capitalize',
        href: 'javascript:;',
        onClick: () => onShowScriptContent(row.id, row.title + (row.type === 'shell' ? '.sh' : ''))
      }, cellValue)
    }
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
  currentItem.value = {content: '#!/bin/bash'} as Script.ScriptItem
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

const onClickRunScript = async (script: Script.ScriptItem) => {
  currentScript.value = JSON.parse(JSON.stringify(script))
  isCron.value = false
  runScript.value.scriptId = script.id
  runScript.value.title = script.title
  runScript.value.desc = script.desc
  runScript.value.ms = await Host.getHosts()
  runScript.value.mgs = await Host.getGroups()
  showRunScript.value = true
}

const onClickCronRunScript = async (script: Script.ScriptItem) => {
  currentScript.value = JSON.parse(JSON.stringify(script))
  isCron.value = true
  runScript.value.scriptId = script.id
  runScript.value.title = script.title
  runScript.value.desc = script.desc
  runScript.value.ms = await Host.getHosts()
  runScript.value.mgs = await Host.getGroups()
  showRunScript.value = true
}

const onSubmitRunScript = async () => {
  const hostIds = []
  if (runScript.value.machineGroupId) {
    const temp = runScript.value.mgs.find((item) => item.id == runScript.value.machineGroupId)
    if (temp) {
      temp.hosts.forEach((item) => {
        hostIds.push(item.id)
      })
    }
  } else {
    hostIds.push(...runScript.value.hostIds)
  }
  if (hostIds.length === 0) {
    ElMessage.warning(t('script.noHost'))
    return
  }
  if (isCron.value) {
    await Script.cronExecScript({
      cronString: runScript.value.cron,
      desc: runScript.value.desc,
      enabled: true,
      executor: 'script',
      params: JSON.stringify({ scriptId: runScript.value.scriptId, hostIds: hostIds, params: params.value }),
      title: runScript.value.title
    })
    showRunScript.value = false
  } else {
    await Script.execScript(runScript.value.scriptId, hostIds, params.value)
    showRunScript.value = false
    await router.push('/script/record')
  }
}

const onShowScriptContent = (id: string, title: string) => {
  window.open(`/api/v1/script/${id}/${title}`, '_blank')
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
          <el-button size="small" text bg type="primary" @click="handleEdit(scope.row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button size="small" text bg type="danger" @click="handleDelete(scope.row)">
            {{ $t('table.delete') }}
          </el-button>
          <el-button size="small" text bg type="primary" @click="onClickRunScript(scope.row)">
            {{ $t('script.run') }}
          </el-button>
          <el-button size="small" text bg type="primary" @click="onClickCronRunScript(scope.row)">
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
          <!--          <el-input v-model="currentItem.content" type="textarea" :disabled="drawerMode==='detail'" />-->
          <Codemirror
            v-model:value="currentItem.content"
            :options="cmOptions"
            border
            ref="cmRef"
            height="400"
            width="100%"
          >
          </Codemirror>
        </el-form-item>
        <el-form-item :label="$t('script.type')">
          <el-input v-model="currentItem.type" disabled />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div v-if="drawerMode=='edit' || drawerMode=='add'">
        <el-button size="small" @click="showDrawer=false">{{ $t('cancel') }}</el-button>
        <el-button size="small" type="primary" v-if="drawerMode=='edit' || drawerMode=='add'" @click="onSubmit">
          {{ $t('save') }}
        </el-button>
      </div>
    </template>
  </el-drawer>
  <el-dialog
    v-model="showRunScript"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    class="max-w-[600px] min-w-[420px] max-h-[800px] overflow-y-auto"
    :title="$t('script.run')"
  >
    <div class="font-bold select-none">
      <el-form
        label-position="top"
        label-width="auto"
        :model="currentScript"
        size="small"
      >
        <el-form-item :label="$t('script.title')">
          <el-input v-model="runScript.title" :disabled="!isCron" />
        </el-form-item>
        <el-form-item :label="$t('script.desc')" v-if="isCron">
          <el-input v-model="runScript.desc" :disabled="!isCron" />
        </el-form-item>
        <el-form-item :label="$t('script.cronStr')" v-if="isCron">
          <el-input v-model="runScript.cron" />
        </el-form-item>
        <el-form-item :label="$t('script.params')">
          <el-input v-model="params" />
        </el-form-item>
        <el-tabs v-model="runScript.type" @tab-change="onRunScriptTabChange">
          <el-tab-pane label="选择机器" name="machine">
            <el-form-item label="">
              <el-select v-model="runScript.hostIds" multiple default-first-option>
                <el-option
                  v-for="m in runScript.ms"
                  :key="m.id"
                  :label="`${m.title}: ${m.hostInfo?.username}@${m.hostInfo.host}:${m.hostInfo.port}`"
                  :value="m.id"
                />
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="选择机器组" name="machineGroup">
            <el-form-item label="">
              <el-select v-model="runScript.machineGroupId" default-first-option>
                <el-option
                  v-for="m in runScript?.mgs"
                  :key="m.id"
                  :label="`${m.title}`"
                  :value="m.id"
                />
              </el-select>
            </el-form-item>
            <div class="flex gap-2 flex-wrap">
              <div
                class="bg-blue-100 rounded-full px-2 py-1 text-xs text-gray-500"
                v-for="m in runScript.mgs?.find(
                      (i) => i.id === runScript.machineGroupId
                    )?.hosts"
                :key="m.id"
              >
                {{ m.title }}: {{ m.hostInfo.username }}@{{ m.hostInfo.host }}:{{
                  m.hostInfo.port
                }}
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <template #footer>
            <span>
              <el-button @click="showRunScript = false">取消</el-button>
              <el-button type="primary" @click="onSubmitRunScript">提交</el-button>
            </span>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>