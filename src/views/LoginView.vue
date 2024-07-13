<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useSystemStore } from '@/stores/system'
import GithubIcon from '@/components/icons/GithubIcon.vue'
import GitlabIcon from '@/components/icons/GitlabIcon.vue'
import { User } from '@/views/LoginView'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const systemStore = useSystemStore()
const router = useRouter()

const username = ref('')
const password = ref('')

const login = async () => {
  if (!username.value || !password.value) {
    ElMessage.error(t('usernameOrPasswordNotNull'))
    return
  }
  await User.login(username.value, password.value)
  await router.replace(router.currentRoute.value.query.redirectURL as string ?? '/')
}

const loading = ref(false)

const availableOAuth = ref<User.AvailableOAuth[]>([])

const getAvailableOAuth = async () => {
  loading.value = true
  let oauths = await User.getAvailableOAuth()
  oauths.sort((a, b) => a.type.localeCompare(b.type))
  availableOAuth.value = oauths
  loading.value = false
}

const onClickOAuthLogin = async (oauth: string) => {
  loading.value = true
  let url = await User.getOAuthURL(oauth, router.currentRoute.value.query.redirectURL as string)
  // loading.value = false
  window.open(url, '_self')
}

const init = async () => {
  let userInfo = await User.getUserInfo()
  if (userInfo) {
    await router.replace(router.currentRoute.value.query.redirectURL as string ?? '/')
  } else {
    await getAvailableOAuth()
  }
}

init()

</script>

<template>
  <div
    class="fixed inset-0 select-none overflow-hidden transition duration-300 ease-in-out bg-gradient-to-bl from-indigo-300 dark:from-slate-900 to-slate-200 dark:to-slate-700">
    <div class="absolute top-0 bottom-0 left-0 right-0 bg-opacity-40 bg-white h-fit w-[460px] m-auto p-8 rounded-2xl">
      <div class="flex flex-col gap-16">
        <div class="flex flex-col gap-4">
          <router-link to="/">
            <div class="flex items-center">
              <img class="w-8 h-8" :src="systemStore.website.logo" alt="logo">
              <div class="text-2xl font-bold text-teal-400">{{ systemStore.website.title }}.</div>
            </div>
          </router-link>
          <div class="text-5xl font-bold">{{ $t('signIn') }}</div>
        </div>
        <div>
          <el-form label-position="top">
            <el-form-item :label="$t('username')">
              <el-input v-model="username" />
            </el-form-item>
            <el-form-item :label="$t('password')">
              <el-input v-model="password" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button class="w-full" type="primary" size="large" :disabled="loading" @click="login">
                {{ $t('signIn') }}
              </el-button>
            </el-form-item>
          </el-form>
          <div class="flex items-center gap-4">
            <div v-for="item in availableOAuth" :key="item.oauth">
              <el-popover trigger="hover" :width="120">
                <template #reference>
                  <div class="w-6 h-6">
                    <GithubIcon class="w-full h-full cursor-pointer" v-if="item.type === 'github'" @click="onClickOAuthLogin(item.oauth)" />
                    <GitlabIcon class="w-full h-full cursor-pointer" v-if="item.type === 'gitlab'" @click="onClickOAuthLogin(item.oauth)" />
                  </div>
                </template>
                <div class="text-center text-xs text-gray-500">
                  {{ (item.type === 'github' ? $t('signWithGithub') : $t('signWithGitlab')).replaceAll('Github', item.oauth).replaceAll('Gitlab', item.oauth)
                  }}
                </div>
              </el-popover>
<!--              <div class="w-6 h-6">-->
<!--                <GithubIcon class="w-full h-full cursor-pointer" v-if="item.type === 'github'" @click="onClickOAuthLogin(item.oauth)" />-->
<!--                <GitlabIcon class="w-full h-full cursor-pointer" v-if="item.type === 'gitlab'" @click="onClickOAuthLogin(item.oauth)" />-->
<!--              </div>-->
            </div>
          </div>
        </div>
        <div class="text-center text-xs text-gray-500" v-html="$t('signInNote')" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>