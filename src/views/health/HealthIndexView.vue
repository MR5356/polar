<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Health } from '@/views/health/HealthIndexView'
import withLoading from '@/utils/loading'
import { ElMessageBox, ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import HealthItemView from '@/views/health/HealthItemView.vue'
import EmptyImage from '@/assets/surfing.svg'
import { Plus } from '@icon-park/vue-next'
import HealthStatisticsView from '@/views/health/HealthStatisticsView.vue'

const { t } = useI18n()

const healthList = ref<Health.HealthItem[]>([])
const healthStatistics = ref<Health.Statistics>(null as Health.Statistics)
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
  await Health.getHealthList().then((res) => {
    healthList.value = res ?? healthList.value
  }).catch(() => {
    ElNotification({
      title: t('notification.title.error'),
      dangerouslyUseHTMLString: true,
      message: '数据加载失败, 请尝试<span class="text-blue-500 underline underline-offset-4 cursor-pointer px-1">刷新页面</span>重新加载',
      type: 'error',
      duration: 0,
      onClick() {
        history.go(0)
      }
    })
    clearInterval(interval.value)
  })
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
}

init()
</script>

<template>
  <div class="absolute inset-0 flex flex-col overflow-hidden">
    <!-- 顶部 -->
<!--    <div class="sticky top-0 select-none flex justify-between items-center px-4 py-2 bg-sky-100 dark:bg-slate-700 z-10">-->
<!--      <div class="flex items-center gap-4">-->
<!--        <el-button class="uppercase font-bold" @click="onClickAddHealth" type="info" size="small" round>-->
<!--          {{ $t('health.new')-->
<!--          }}-->
<!--        </el-button>-->
<!--      </div>-->
<!--      <div></div>-->
<!--    </div>-->

    <div class="p-4 flex gap-4 select-none h-[96%]">
      <!-- 左侧内容 -->
      <div class="w-3/4 h-fit grid grid-cols-2 gap-4">
        <div class="col-span-2">
          <HealthStatisticsView />
        </div>
<!--        <div class="col-span-1 h-[250px] bg-white bg-opacity-60 dark:bg-slate-600 rounded-lg p-4">-->
<!--          <div class="text-sm font-bold border-green-400 border-l-4 rounded pl-1">检查类型统计</div>-->
<!--          <div class="w-full h-full" ref="mainChart"></div>-->
<!--        </div>-->
<!--        <div class="col-span-1 h-[250px] bg-white bg-opacity-60 dark:bg-slate-600 rounded-lg p-4">-->
<!--          <div class="text-sm font-bold border-green-400 border-l-4 rounded pl-1">运行状态统计</div>-->
<!--          <div class="w-full h-full" ref="statusChart"></div>-->
<!--        </div>-->
        <div class="col-span-2 grid grid-cols-4 gap-4 bg-white bg-opacity-60 dark:bg-slate-600 rounded-lg p-4">
          <div class="col-span-4 text-sm font-bold border-green-400 border-l-4 rounded pl-1">监控列表</div>
          <div class="cursor-pointer text-slate-700 dark:text-slate-100 shadow-lg shadow-sky-100 bg-sky-50 dark:bg-slate-600 rounded-lg p-4 relative" @click="onClickAddHealth" >
            <div class="absolute w-full h-full inset-0 m-auto flex justify-center items-center gap-2">
              <plus theme="outline" size="22" fill="#332" :strokeWidth="4" />
              <div class="text-sm font-bold">{{ $t('health.new') }}</div>
            </div>
          </div>
          <template v-for="health in healthList" :key="health.id">
            <el-popover :width="88" trigger="contextmenu" placement="bottom-end" class="p-0">
              <template #reference>
                <HealthItemView class="" :health="health" />
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
      </div>
      <!-- 右侧栏 -->
      <div class="w-1/4 flex flex-col gap-4 overflow-y-auto">
        <div class="flex flex-col gap-4 bg-white bg-opacity-60 dark:bg-slate-600 rounded-lg p-4">
          <div class="text-sm font-bold border-red-400 border-l-4 rounded pl-1">检查出错列表</div>
          <div v-if="!healthStatistics?.errorList || !healthStatistics?.errorList.length">
            <el-empty :description="$t('health.noError')" :image="EmptyImage" />
          </div>
          <template v-for="health in healthStatistics?.errorList" :key="health.id">
            <el-popover :width="88" trigger="contextmenu" placement="bottom-end" class="p-0">
              <template #reference>
                <HealthItemView :health="health" />
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
        <div class="grid grid-cols-1 gap-4 bg-white bg-opacity-60 dark:bg-slate-600 rounded-lg p-4">
          <div class="text-sm font-bold border-red-400 border-l-4 rounded pl-1">响应缓慢列表</div>
          <div v-if="!healthStatistics?.slowList || !healthStatistics?.slowList.length">
            <el-empty :description="$t('health.noSlow')" :image="EmptyImage" />
          </div>
          <template v-for="health in healthStatistics?.slowList" :key="health.id">
            <el-popover :width="88" trigger="contextmenu" placement="bottom-end" class="p-0">
              <template #reference>
                <HealthItemView :health="health" />
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
      </div>
    </div>
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
      <!--      <el-form-item label="启用">-->
      <!--        <el-switch v-model="newHealth.enabled" />-->
      <!--      </el-form-item>-->
      <div class="p-2 pl-4 bg-slate-100 w-full">
        <el-form-item label="类型" required>
          <el-select v-model="newHealth.type" class="w-full" @change="onHealthTypeChange">
            <el-option
              v-for="item in healthCheckTypes"
              :key="item.type"
              :label="$t('health.' + item.title)"
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