<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Health } from '@/views/health/HealthIndexView'
import withLoading from '@/utils/loading'
import { ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const healthList = ref<Health.HealthItem[]>([])
const showAddHealth = ref(false)
const isEdit = ref(false)
const newHealth = ref<Health.HealthItem>(null as Health.HealthItem)
const newHealthParams = ref<Health.Param[]>([])

const interval = ref()

onMounted(() => {
  interval.value = setInterval(init, 1000)
})

onBeforeUnmount(() => {
  clearInterval(interval.value)
})

const init = async () => {
  healthList.value = await Health.getHealthList()
}

const healthCheckTypes = ref<Health.HealthCheckType[]>([])

async function onClickAddHealth() {
  isEdit.value = false
  healthCheckTypes.value = await Health.getHealthTypes()
  newHealth.value = {
    title: '',
    desc: '',
    type: healthCheckTypes.value[0].type,
    params: '',
    enabled: true
  }
  newHealthParams.value = healthCheckTypes.value.find((item) => item.type === newHealth.value.type).params
  showAddHealth.value = true
}

async function onDeleteHealth(id: string) {
  ElMessageBox.confirm(t('confirmDelete'), t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning'
  }).then(async () => {
    await withLoading(Health.deleteHealth, t('loading'), id)
    await init()
  })
}

async function onSubmitHealth() {
  newHealth.value.params = JSON.stringify(newHealthParams.value)
  await withLoading(async () => {
    if (!isEdit.value) {
      await Health.addHealth(newHealth.value)
    } else {
      await Health.updateHealth(newHealth.value.id, newHealth.value)
    }
  })
  showAddHealth.value = false
  await init()
}

function onHealthTypeChange() {
  newHealthParams.value = healthCheckTypes.value.find((item) => item.type === newHealth.value.type).params
  console.log(newHealthParams.value)
  console.log(newHealth.value)
}

init()
</script>

<template>
  <div class="select-none flex justify-between items-center px-4 py-2 bg-gray-400 bg-opacity-20">
    <div class="flex items-center gap-4">
      <el-button class="uppercase font-bold" @click="onClickAddHealth" type="info" size="small" round>
        {{ $t('health.new')
        }}
      </el-button>
    </div>
    <div></div>
  </div>
  <div class="select-none p-4 grid grid-cols-4 gap-4">
    <template v-for="health in healthList" :key="health.id">
      <el-popover :width="88" trigger="contextmenu" placement="bottom-end" class="p-0">
        <template #reference>
          <div class="bg-white dark:bg-slate-600 rounded-lg p-4 relative">
            <div class="absolute right-2 top-2 flex gap-1 items-center">
        <span class="relative flex h-2.5 w-2.5 items-center justify-center">
          <span v-if="health.status === Health.STATUS_UP"
                :class="'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ' + (health.rtt < 180 ? 'bg-green-500' : 'bg-yellow-500')"></span>
          <span
            :class="'relative inline-flex rounded-full h-2.5 w-2.5 ' + (health.status === Health.STATUS_UP ? health.rtt < 180 ? 'bg-green-500' : 'bg-yellow-500' : 'bg-red-500')"></span>
        </span>
              <div class="text-[0.6rem] w-8 flex justify-start items-center">
                <div>{{ health.rtt < 999 ? health.rtt : '999' }}</div>
                <div>ms</div>
              </div>
            </div>
            <div class="flex justify-start items-center gap-2">
              <div>
                <img :src="Health.getTypeIcon(health.type)"
                     class="w-10 h-10 min-w-10 min-h-10 bg-slate-500 bg-opacity-30 dark:bg-slate-400 rounded-lg p-1"
                     alt="logo">
              </div>
              <div class="flex flex-col">
                <div class="text-sm font-bold">{{ health.title }}</div>
                <div class="text-xs opacity-40">{{ health.desc }}</div>
              </div>
            </div>
          </div>
        </template>
        <template #default>
          <div class="flex flex-col gap-0 text-sm">
            <!--            <div-->
            <!--              class="w-full hover:bg-gray-50 p-1.5 rounded cursor-pointer"-->
            <!--              @click="onClickEditMachine(host)"-->
            <!--            >-->
            <!--              编辑-->
            <!--            </div>-->
            <div
              class="w-full hover:bg-gray-50 p-1.5 rounded cursor-pointer"
              @click="onDeleteHealth(health.id)"
            >
              删除
            </div>
          </div>
        </template>
      </el-popover>
    </template>
  </div>
  <el-dialog
    v-model="showAddHealth"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    class="max-w-[600px] min-w-[420px] max-h-[800px] overflow-y-auto"
    :title="isEdit ? $t('health.edit') : $t('health.new')"
  >
    <el-form :model="newHealth" label-position="top">
      <el-form-item label="名称" required>
        <el-input v-model="newHealth.title" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="newHealth.desc" />
      </el-form-item>
      <el-form-item label="启用">
        <el-switch v-model="newHealth.enabled" />
      </el-form-item>
      <div class="p-2 pl-4 bg-slate-100 w-full">
        <el-form-item label="类型" required>
          <el-select v-model="newHealth.type" class="w-full" @change="onHealthTypeChange">
            <el-option
              v-for="item in healthCheckTypes"
              :key="item.type"
              :label="item.title"
              :value="item.type"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-for="param in newHealthParams" :key="param.key" :label="param.title" :required="param.required">
          <el-input v-if="param.type === 'string'" :placeholder="param.desc" v-model="param.value" />
          <el-input-number v-else-if="param.type === 'number'" :placeholder="param.desc" v-model="param.value" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showAddHealth = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="onSubmitHealth">{{ $t('save') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>