<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Host } from './HostIndexView'
import { Terminal, MoreOne } from '@icon-park/vue-next'
import withLoading from '@/utils/loading'
import { ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import getGroups = Host.getGroups

const router = useRouter()
const { t } = useI18n()

const newHost = ref<Host.HostItem>({} as Host.HostItem)
const isEdit = ref(false)
const showAddMachine = ref(false)

const hostGroupsList = ref<Host.Group[]>([])

async function init() {
  hostGroupsList.value = await withLoading(Host.getGroups)
}

init()

async function onClickEditMachine(host: Host.HostItem) {
  isEdit.value = true
  newHost.value = JSON.parse(JSON.stringify(host))
  newHost.value.hostInfo.password = ''
  showAddMachine.value = true
}

async function onClickAddMachine() {
  isEdit.value = false
  hostGroupsList.value = await withLoading(getGroups)
  newHost.value = {
    title: '',
    desc: '',
    groupId: hostGroupsList.value[0]?.id || '默认分组',
    hostInfo: {
      host: '',
      port: 22,
      username: 'root',
      password: ''
    }
  }
  showAddMachine.value = true
}

async function onSubmitMachine() {
  await withLoading(async () => {
    let g = hostGroupsList.value.find((item) => item.id === newHost.value.groupId)
    if (!g) {
      await Host.addHostGroup(newHost.value.groupId)
      hostGroupsList.value = await getGroups()
      g = hostGroupsList.value.find((item) => item.title === newHost.value.groupId)
      newHost.value.groupId = g.id
    }
    if (!newHost.value.desc) {
      newHost.value.desc = `${newHost.value.hostInfo.username}@${newHost.value.hostInfo.host}:${newHost.value.hostInfo.port}`
    }
    if (!isEdit.value) {
      await Host.addHost(newHost.value)
    } else {
      await Host.updateHost(newHost.value.id, newHost.value)
    }
    showAddMachine.value = false
  }, t('loading'))
  await init()
}

async function onDeleteMachine(id: string) {
  ElMessageBox.confirm(t('confirmDelete'), t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning'
  }).then(async () => {
    await withLoading(Host.deleteHost, '删除中', id)
    await init()
  })
}

async function onDeleteHostGroup(id: string) {
  ElMessageBox.confirm(t('confirmDeleteGroup'), t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning'
  }).then(async() => {
    await withLoading(Host.deleteHostGroup, '删除中', id)
    await init()
  })
}

const openTerminal = (host: Host.HostItem) => {
  router.push(`/terminal/${host.id}`)
  // let terminal = router.resolve({ path: '/terminal/' + host.id })
  //
  // let win = window.open('', terminal.href)
  // if (win.location.href === 'about:blank') {
  //   win = window.open(terminal.href, terminal.href)
  // } else if (win.location.href === window.location.href) {
  //   window.name = ''
  //   win = window.open(terminal.href, terminal.href)
  // } else {
  //   win.focus()
  // }
}
</script>

<template>
  <div class="flex justify-between items-center px-4 py-2 bg-gray-400 bg-opacity-20">
    <div class="flex items-center gap-4">
      <el-button class="uppercase font-bold" @click="onClickAddMachine" type="info" size="small" round>{{ $t('host.new')
        }}
      </el-button>
    </div>
    <div></div>
  </div>
  <div class="p-8 flex flex-col gap-8">
    <div v-for="group in hostGroupsList" :key="group.id">
      <el-popover :width="88" trigger="contextmenu" placement="right-start" class="p-0">
        <template #reference>
          <div class="w-fit text-sm font-bold capitalize mb-3 select-none" v-if="group.hosts.length > 0">{{ group.title }}</div>
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
              @click="onDeleteHostGroup(group.id)"
            >
              删除
            </div>
          </div>
        </template>
      </el-popover>
      <div class="grid grid-cols-4 gap-4">
        <div class="bg-white dark:bg-opacity-30 p-2 rounded-xl" v-for="host in group.hosts" :key="host.id">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div>
                <img :src="Host.metaInfos.os[host.metaInfo.os]"
                     class="w-10 h-10 bg-slate-500 bg-opacity-30 dark:bg-slate-400 rounded-lg p-1" alt="logo">
              </div>
              <div class="flex flex-col">
                <div class="text-sm">{{ host.title }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-300">{{ host.desc }}
                </div>
              </div>
            </div>
            <div class="flex gap-2 items-center opacity-50">
              <Terminal size="20" title="终端" @click="() => openTerminal(host)" />
              <el-popover :width="88" trigger="hover" class="p-0">
                <template #reference>
                  <MoreOne />
                </template>
                <template #default>
                  <div class="flex flex-col gap-0 text-sm">
                    <div
                      class="w-full hover:bg-gray-50 p-1.5 rounded cursor-pointer"
                      @click="onClickEditMachine(host)"
                    >
                      编辑
                    </div>
                    <div
                      class="w-full hover:bg-gray-50 p-1.5 rounded cursor-pointer"
                      @click="onDeleteMachine(host.id)"
                    >
                      删除
                    </div>
                  </div>
                </template>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="showAddMachine"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    class="max-w-[600px] min-w-[420px]"
    :title="isEdit ? '编辑主机' : '添加主机'"
  >
    <el-form :model="newHost">
      <el-form-item label="主机名称">
        <el-input v-model="newHost.title" />
      </el-form-item>
      <el-form-item label="主机地址">
        <el-input v-model="newHost.hostInfo.host" />
      </el-form-item>
      <el-form-item label="主机端口">
        <el-input-number :min="1" :max="65535" :step="1" v-model="newHost.hostInfo.port" />
      </el-form-item>
      <el-form-item label="登录用户">
        <el-input v-model="newHost.hostInfo.username" />
      </el-form-item>
      <el-form-item label="主机密码">
        <el-input
          type="password"
          v-model="newHost.hostInfo.password"
        />
      </el-form-item>
      <el-form-item label="主机简介">
        <el-input v-model="newHost.desc" />
      </el-form-item>
      <el-form-item label="主机分组">
        <el-select
          v-model="newHost.groupId"
          placeholder="选择分组"
          filterable
          allow-create
          default-first-option
        >
          <el-option
            v-for="group in hostGroupsList"
            :key="group.id"
            :label="group.title"
            :value="group.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showAddMachine = false">取消</el-button>
        <el-button type="primary" @click="onSubmitMachine">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>