<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import ColorView from '@/components/ColorView.vue'
import { useSystemStore } from '@/stores/system'
import { locales } from '@/lang/i18n'
import { useDark, useToggle } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { ElMessageBox } from 'element-plus'
import { User } from '@/views/LoginView'
import { ref } from 'vue'
import { Avatar, Logout } from '@icon-park/vue-next'
import NavigationView from '@/layouts/TabbedFramework/NavigationView.vue'
import TabView from '@/layouts/TabbedFramework/TabView.vue'

const { locale, t } = useI18n()
const systemStore = useSystemStore()
const isDark = useDark()
const toggleDark = useToggle(isDark)
const router = useRouter()

const userInfo = ref<User.UserInfo | null>(null)

const getUserInfo = async () => {
  userInfo.value = await User.getUserInfo()
}

const setLanguage = (value: string = systemStore.language) => {
  systemStore.setLanguage(value)
  locale.value = value
}

const onClickLogout = () => {
  ElMessageBox.confirm(t('confirmLogout'), t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning'
  }).then(async () => {
    await User.logout()
    router.go(0)
  })
}

getUserInfo()
setLanguage()
</script>

<template>
  <el-container
    class="fixed inset-0 overflow-hidden transition duration-300 ease-in-out">
    <el-aside class="text-slate-600 dark:text-slate-400 bg-indigo-100 bg-opacity-60 dark:bg-slate-900 relative">
      <div class="pl-6 py-4 flex flex-col justify-between h-full">
        <!-- start -->
        <div class="flex flex-col gap-8 flex-grow">
          <!-- website title -->
          <div class="flex items-center justify-between mr-6">
            <router-link to="/">
              <div class="flex gap-2 items-center">
                <img class="w-8 h-8" :src="systemStore.website.logo" alt="logo">
                <div class="text-2xl font-bold text-teal-400">{{ systemStore.website.title }}.</div>
              </div>
            </router-link>
            <div class="flex items-center gap-3">
              <div class="cursor-pointer opacity-80">
                <el-popover trigger="hover">
                  <template #reference>
                    <img
                      class="w-6 h-6"
                      src="data:image/svg+xml,%3Csvg t='1719983297570' class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' p-id='7055' width='200' height='200'%3E%3Cpath d='M496 976c238.592 0 432-193.408 432-432 0-199.104-134.688-366.736-317.92-416.784-14.448-3.936 16.208-18.032-10.864-26.688-41.04-13.104-142.8-21.136-166.608-21.136-21.536 0 20.688 34.176 0 37.216C224.08 147.28 64 326.944 64 544c0 238.592 193.408 432 432 432z' fill='%23FFFFFF' p-id='7056'%3E%3C/path%3E%3Cpath d='M496 544m-368 0a368 368 0 1 0 736 0 368 368 0 1 0-736 0Z' fill='%23A5F2DA' p-id='7057'%3E%3C/path%3E%3Cpath d='M641.792 782.16c0 58.4-75.312 101.6-223.824 20.72-148.496-80.864-172.272 109.424-116.272 134.752 37.344 16.88 113.904 29.76 229.664 38.608 156.208-39.584 260.512-104.272 312.944-194.08 21.472-36.784 54.896-68.816 61.184-108.4-124.464-19.712-263.696-13.728-263.696 108.4zM272.48 352.544c-14.88-51.92-66.24-51.92-154.064 0a3811.376 3811.376 0 0 1-48.112 119.152c-20.672 48.352-21.888 86.096-10.944 132.896 10.944 46.816 14.432 109.136 66.48 108.144 52.032-0.992 24-67.76 109.968-121.408 85.952-53.648 58.992-160.912 36.672-238.784z' fill='%23FFFFFF' p-id='7058'%3E%3C/path%3E%3Cpath d='M661.392 820.8c-8.24 52-109.952 106.368-244.88 32.896s-140.56 74.464-89.68 97.472c33.92 15.344 113.072 23.104 237.424 23.296 127.456-20.848 214.992-72.08 262.624-153.664 19.504-33.424 46.32-64.496 52.016-100.464-113.088-17.904-200.624-6.096-217.504 100.464zM110.16 388.32c-18.272 15.184-33.776 37.648-46.496 67.392-19.088 44.64-6.944 99.488-8.4 133.504-1.456 34.032 3.968 81.824 44.4 81.824s13.616-53.232 92.96-102.752 67.04-114.4 46.448-186.272c-13.744-47.92-56.72-45.808-128.912 6.304z' fill='%2324D796' p-id='7059'%3E%3C/path%3E%3Cpath d='M384 64h528a32 32 0 0 1 32 32v384a32 32 0 0 1-32 32H432.608L352 544V96a32 32 0 0 1 32-32z' fill='%23FFFFFF' p-id='7060'%3E%3C/path%3E%3Cpath d='M911.36 566.88C899.296 785.808 717.952 959.632 496 959.632a413.92 413.92 0 0 1-221.84-64.16c-4.96-24.864 1.088-55.744 16.528-74.864 20.224-25.04 53.808-28.864 102.192-2.512 139.552 75.984 247.472 52.928 247.472-34.784 0-85.952 81.568-113.872 220.192-96.176 8.144 1.04 13.856-30.464 6-31.488-157.328-20.416-258.176 13.648-258.176 127.664 0 56.192-78.448 72.96-200.16 6.672-61.104-33.264-111.696-27.504-142.4 10.528-15.504 19.216-24.064 45.504-25.184 71.36a417.616 417.616 0 0 1-113.44-135.92c31.36-9.456 44.464-26.176 57.568-60.848 12.72-33.616 21.568-47.04 48.208-63.248 91.504-55.744 99.648-162.736 51.552-270.272-22.432-50.176-68.912-66.8-126.048-40.896a417.12 417.12 0 0 1 122.32-113.12l-16.576-27.36A448.544 448.544 0 0 0 94.992 344.032c-0.256 0.224-0.512 0.416-0.768 0.656l0.272 0.288A446.608 446.608 0 0 0 48 543.632c0 247.424 200.576 448 448 448 239.104 0 434.448-187.312 447.328-423.184 0.448-8.224-31.536-9.264-31.968-1.568zM120.768 363.952c67.792-59.392 114.352-54.384 134.496-9.328 42.32 94.64 35.488 184.512-38.992 229.872-34.032 20.736-46.48 39.6-61.488 79.264-10.512 27.808-17.84 36.8-41.632 42.816A414.816 414.816 0 0 1 80 543.632c0-63.632 14.448-124.72 40.768-179.68z' fill='%23203E81' p-id='7061'%3E%3C/path%3E%3Cpath d='M912 48H384a48 48 0 0 0-48 48v471.568L435.664 528H912a48 48 0 0 0 48-48V96a48 48 0 0 0-48-48z m16 432a16 16 0 0 1-16 16H429.552L368 520.432V96a16 16 0 0 1 16-16h528a16 16 0 0 1 16 16v384z' fill='%23203E81' p-id='7062'%3E%3C/path%3E%3Cpath d='M821.728 223.296c-9.328-5.888-23.936-8.832-43.824-8.832-21.872 0-39.056 4.272-51.568 12.816s-20.256 21.296-23.28 38.288l27.504 3.6c2.608-12.192 7.424-20.512 14.448-24.992s16.592-6.72 28.672-6.72c9.488 0 17.024 1.152 22.656 3.44s9.712 5.312 12.272 9.056 4.096 7.376 4.608 10.864 0.784 9.456 0.784 17.888c-6.352 2.288-14.432 4.224-24.224 5.776l-26.256 3.904c-24.064 2.912-40.96 8.832-50.704 17.728s-14.608 20.24-14.608 33.984c0 14.368 5.056 25.936 15.152 34.688s23.904 13.12 41.408 13.12c21.872 0 42.24-8.128 61.088-24.368V384h26.256v-107.184c0-13.12-1.072-23.856-3.2-32.192s-7.856-15.44-17.184-21.328z m-7.728 87.728c0 19.888-5.28 33.984-15.856 42.272s-22.784 12.416-36.64 12.416c-10.736 0-18.96-2.48-24.688-7.424s-8.592-11.216-8.592-18.832c0-15.104 10.624-24.096 31.872-26.96s39.216-6.752 53.904-11.648v10.176zM544.256 154.944L456.288 384h32.032l25.312-69.68h95.632L636.128 384h34.224l-93.44-229.056h-32.656z m-22.032 135.312l37.264-103.936h2.912c2.912 11.248 18.896 54.336 37.648 103.936h-77.824z' fill='%23203E81' p-id='7063'%3E%3C/path%3E%3C/svg%3E"
                      alt="language">
                  </template>
                  <div class="flex flex-col gap-2">
                    <div v-for="item in locales" :key="item.key" class="cursor-pointer" @click="setLanguage(item.key)">
                      <div
                        :class="'transition duration-300 ease-in-out ' + (item.key === systemStore.language ? 'text-blue-500' : '')">
                        {{ item.value }}
                      </div>
                    </div>
                  </div>
                </el-popover>
              </div>
              <div @click="toggleDark()">
                <div v-if="!isDark" class="cursor-pointer opacity-80">
                  <el-tooltip trigger="hover" :content="$t('darkMode')" placement="bottom">
                    <img
                      class="w-6 h-6"
                      src="data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yNC4wMDMzIDRMMjkuMjczNyA5LjI3MDM4SDM4LjcyOTZWMTguNzI2M0w0NCAyMy45OTY3TDM4LjcyOTYgMjkuMjczN1YzOC43Mjk2SDI5LjI3MzdMMjQuMDAzMyA0NEwxOC43MjY0IDM4LjcyOTZIOS4yNzAzNlYyOS4yNzM3TDQgMjMuOTk2N0w5LjI3MDM2IDE4LjcyNjNWOS4yNzAzOEgxOC43MjY0TDI0LjAwMzMgNFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNyAxN0MyNyAyNSAyMiAyNiAxNyAyNkMxNyAzMCAyMy41IDM0IDI5IDMwQzM0LjUgMjYgMzEgMTcgMjcgMTdaIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4="
                      alt="dark" />
                  </el-tooltip>
                </div>
                <div v-else class="cursor-pointer opacity-80">
                  <el-tooltip trigger="hover" :content="$t('lightMode')" placement="bottom">
                    <img
                      class="w-6 h-6"
                      src="data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yNC4wMDMzIDRMMjkuMjczNyA5LjI3MDM4SDM4LjcyOTZWMTguNzI2M0w0NCAyMy45OTY3TDM4LjcyOTYgMjkuMjczN1YzOC43Mjk2SDI5LjI3MzdMMjQuMDAzMyA0NEwxOC43MjY0IDM4LjcyOTZIOS4yNzAzNlYyOS4yNzM3TDQgMjMuOTk2N0w5LjI3MDM2IDE4LjcyNjNWOS4yNzAzOEgxOC43MjY0TDI0LjAwMzMgNFoiIGZpbGw9IiNmZmZhMmYiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNyAxN0MyNyAyNSAyMiAyNiAxNyAyNkMxNyAzMCAyMy41IDM0IDI5IDMwQzM0LjUgMjYgMzEgMTcgMjcgMTdaIiBmaWxsPSIjNmM3MWMwIiBzdHJva2U9IiNGRkYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4="
                      alt="light" />
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
          <!-- user info -->
          <ColorView custom-class="transition duration-300 ease-in-out bg-indigo-100 dark:bg-slate-700 mr-6">
            <div class="flex gap-2 items-center justify-between" v-if="userInfo">
              <div class="flex gap-2 items-center">
                <div>
                  <img :src="userInfo?.avatar" alt="logo"
                       class="bg-slate-500 dark:bg-orange-300 rounded-full w-10 h-10" />
                </div>
                <div>
                  <div class="font-bold transition duration-300 ease-in-out text-black dark:text-white">
                    {{ userInfo?.nickname }}
                  </div>
                  <div
                    class="text-xs transition duration-300 ease-in-out text-gray-500 dark:text-gray-400 truncate max-w-40">
                    {{ userInfo?.username }}
                  </div>
                </div>
              </div>
              <div class="cursor-pointer">
                <el-tooltip trigger="hover" :content="$t('logout')" placement="right">
                  <logout theme="outline" size="18" fill="#111625" @click="onClickLogout" />
                </el-tooltip>
              </div>
            </div>
            <div v-else>
              <router-link to="/login">
                <div class="flex items-center px-2">
                  <avatar />
                  <div class="p-2">{{ $t('signIn') }}</div>
                </div>
              </router-link>
            </div>
          </ColorView>
          <NavigationView class="flex-grow" />
        </div>
        <!-- end -->
        <ColorView custom-class="bg-none mr-6">
          <div class="text-xs text-gray-500" v-html="systemStore.website.copyright" />
        </ColorView>
      </div>
    </el-aside>
    <el-container class="bg-gradient-to-l from-indigo-100 dark:from-slate-900 to-slate-50 dark:to-slate-700">
      <el-main class="relative">
        <TabView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
:deep(.el-header),
:deep(.el-main),
:deep(.el-aside) {
  padding: 0;
}

:deep(.el-header) {
  height: fit-content;
}
</style>