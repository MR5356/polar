<script setup lang="ts">
import { User } from '@/views/user/UserView'
import type { PropType } from 'vue'
import { MoreOne } from '@icon-park/vue-next'

const props = defineProps({
  user: {
    type: Object as PropType<User.UserItem>,
    required: true
  },
  refresh: {
    type: Function,
    required: true
  }
})

const banUser = async (id: string) => {
  await User.banUser(id)
  await props.refresh()
}

const unbanUser = async (id: string) => {
  await User.unbanUser(id)
  await props.refresh()
}
</script>

<template>
  <div class="bg-white dark:bg-slate-700 shadow-lg shadow-sky-100 p-4 rounded-lg flex justify-between gap-4">
    <div class="flex items-center gap-4">
      <a-avatar :size="65" :src="user.avatar" />
      <div>
        <div class="flex items-center gap-2">
          <div class="font-medium text-gray-600 text-nowrap">{{ user.nickname }}</div>
          <a-tag :bordered="false" v-if="user.status === 2" color="error">{{ $t('user.status.' + user.status) }}</a-tag>
          <a-tag :bordered="false" v-else-if="user.status === 1" color="success">{{ $t('user.status.' + user.status) }}</a-tag>
          <a-tag :bordered="false" v-else color="warning">{{ $t('user.status.' + user.status) }}</a-tag>
        </div>
        <div class="text-xs text-gray-500">@{{ $t('user.type.' + user.type) }}</div>
        <div class="text-sm font-medium text-slate-800">{{ user.group ? user.group : $t('user.noGroup') }}</div>
      </div>
    </div>
    <div>
      <el-popover :width="88" trigger="hover" placement="bottom-start" class="p-0">
        <template #reference>
          <MoreOne theme="outline" size="22" fill="#332" :strokeWidth="4" />
        </template>
        <template #default>
          <div class="flex flex-col gap-0 text-sm">
<!--            <div class="w-full hover:bg-gray-50 p-1.5 rounded cursor-pointer">{{ $t('user.action.delete') }}</div>-->
<!--            <div class="w-full hover:bg-gray-50 p-1.5 rounded cursor-pointer">{{ $t('user.action.group') }}</div>-->
            <div class="w-full hover:bg-gray-50 p-1.5 rounded cursor-pointer" v-if="User.hasBanned(user.status)" @click="unbanUser(user.id)">
              {{ $t('user.action.unban') }}
            </div>
            <div class="w-full hover:bg-gray-50 p-1.5 rounded cursor-pointer" v-else @click="banUser(user.id)">{{ $t('user.action.ban') }}</div>
<!--            <div class="w-full hover:bg-gray-50 p-1.5 rounded cursor-pointer">{{ $t('user.action.reset') }}</div>-->
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<style scoped>

</style>