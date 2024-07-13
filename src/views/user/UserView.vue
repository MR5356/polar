<script setup lang="ts">
import { ref } from 'vue'
import { User } from '@/views/user/UserView'
import UserCardView from '@/views/user/UserCardView.vue'

const users = ref<User.UserItem[]>([])

const listUser = async () => {
  users.value = await User.listUser()
}

listUser()
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <div class="flex justify-between text-blue-600">
      <div class="text-lg font-bold">{{ $t('navigation.user') }}</div>
      <div class="flex gap-2">
        <div class="text-sm font-medium border-[1px] border-blue-600 px-4 py-1 rounded-full cursor-not-allowed">{{ $t('user.new') }}</div>
<!--        <div class="text-sm font-medium border-[1px] border-blue-600 px-4 py-1 rounded-full cursor-pointer">{{ $t('user.newGroup') }}</div>-->
      </div>
    </div>
    <div class="grid grid-cols-4 gap-4">
      <UserCardView v-for="user in users" :key="user.id" :user="user" :refresh="listUser"></UserCardView>
    </div>
  </div>
</template>

<style scoped>

</style>