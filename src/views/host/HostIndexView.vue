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

const loading = ref(false)
const newHost = ref<Host.HostItem>({} as Host.HostItem)
const isEdit = ref(false)
const showAddMachine = ref(false)

const hostGroupsList = ref<Host.Group[]>([])

async function init() {
  loading.value = true
  hostGroupsList.value = await Host.getGroups()
  loading.value = false
}

init()

async function onClickEditMachine(host: Host.HostItem) {
  isEdit.value = true
  newHost.value = JSON.parse(JSON.stringify(host))
  newHost.value.hostInfo.password = ''
  showAddMachine.value = true
}

async function onClickContainer(id: string, driver: string) {
  router.push(`/container/${id}/${driver}`)
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
  }).then(async () => {
    await withLoading(Host.deleteHostGroup, '删除中', id)
    await init()
  })
}

const openTerminal = (host: Host.HostItem) => {
  // router.push(`/terminal/${host.id}`)
  // let terminal = router.resolve({ path: '/terminal/' + host.id })
  let terminal = { href: host.id ? `/terminal?id=${host.id}` : `/terminal` }

  let win = window.open('', terminal.href)
  if (win.location.href === 'about:blank') {
    win = window.open(terminal.href, terminal.href)
  } else if (win.location.href === window.location.href) {
    window.name = ''
    win = window.open(terminal.href, terminal.href)
  } else {
    win.focus()
  }
}
</script>

<template>
  <div class="p-4 select-none">
    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-center px-4 py-2 bg-white bg-opacity-80 rounded-lg">
        <div class="uppercase font-bold flex items-center justify-between">
          <el-button @click="onClickAddMachine" type="info" size="small">{{
              $t('host.new')
            }}
          </el-button>
          <el-button
            @click="openTerminal({ id: '' } as Host.HostItem)"
            type="success"
            size="small"
          >{{ $t('navigation.terminal') }}
          </el-button
          >
        </div>
        <div></div>
      </div>
      <template v-for="group in hostGroupsList" :key="group.id">
        <div
          class="bg-white bg-opacity-80 dark:bg-slate-600 p-4 rounded-lg"
          v-if="group.hosts.length > 0"
        >
          <el-popover :width="88" trigger="contextmenu" placement="right-start" class="p-0">
            <template #reference>
              <div class="w-fit text-sm font-bold capitalize mb-3 select-none">
                {{ group.title }}
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
                  @click="onDeleteHostGroup(group.id)"
                >
                  删除
                </div>
              </div>
            </template>
          </el-popover>
          <div class="grid grid-cols-4 gap-4">
            <div
              class="bg-white dark:bg-slate-700 shadow-lg shadow-sky-100 p-4 rounded-lg"
              v-for="host in group.hosts"
              :key="host.id"
            >
              <div class="flex items-center justify-between">
                <el-popover trigger="hover" class="p-0" placement="bottom-start" :width="300">
                  <template #reference>
                    <router-link :to="`/host/${host.id}`">
                      <div class="flex items-center gap-3">
                        <div>
                          <img
                            :src="Host.getOsIcon(host.metaInfo.os)"
                            class="w-10 h-10 min-w-10 min-h-10 bg-slate-500 bg-opacity-30 dark:bg-slate-400 rounded-lg p-1"
                            alt="logo"
                          />
                        </div>
                        <div class="flex flex-col flex-grow">
                          <div class="text-sm">{{ host.title }}</div>
                          <div class="text-xs text-slate-500 dark:text-slate-300 break-all">
                            {{ host.desc }}
                          </div>
                        </div>
                      </div>
                    </router-link>
                  </template>
                  <template #default>
                    <div class="grid grid-cols-3 gap-1">
                      <div class="col-span-3">
                        {{ $t('host.metaInfo.os') }}: {{ host?.metaInfo.os }}
                      </div>
                      <div class="col-span-3">
                        {{ $t('host.metaInfo.cpu') }}: {{ host?.metaInfo.cpu }}
                      </div>
                      <div class="col-span-3">
                        {{ $t('host.metaInfo.mem') }}: {{ host?.metaInfo.mem }}
                      </div>
                      <div class="col-span-3">
                        {{ $t('host.metaInfo.arch') }}: {{ host?.metaInfo.arch }}
                      </div>
                      <div class="col-span-3">
                        {{ $t('host.metaInfo.kernel') }}: {{ host?.metaInfo.kernel }}
                      </div>
                      <div class="col-span-3">
                        {{ $t('host.metaInfo.hostname') }}: {{ host?.metaInfo.hostname }}
                      </div>
                    </div>
                  </template>
                </el-popover>

                <div class="flex gap-2 items-center opacity-50">
                  <el-tooltip placement="top" content="在线终端">
                    <Terminal size="20" @click="() => openTerminal(host)" />
                  </el-tooltip>
                  <el-popover :width="88" trigger="hover" placement="right-start" class="p-0">
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
                        <div class="h-[1px] bg-slate-300 my-1"></div>
                        <div
                          class="w-full hover:bg-gray-50 p-1.5 rounded cursor-pointer"
                          @click="onClickContainer(host.id, 'containerd')"
                          v-if="host.metaInfo.containerd"
                        >
                          Containerd管理
                        </div>
                        <div
                          class="w-full hover:bg-gray-50 p-1.5 rounded cursor-pointer"
                          @click="onClickContainer(host.id, 'docker')"
                          v-if="host.metaInfo.docker"
                        >
                          Docker管理
                        </div>
                      </div>
                    </template>
                  </el-popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
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
        <el-input type="password" v-model="newHost.hostInfo.password" />
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
        <el-button @click="showAddMachine = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="onSubmitMachine">{{ $t('save') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
