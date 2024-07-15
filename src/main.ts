import './assets/main.css'
import '@icon-park/vue-next/styles/index.css';
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/el-dark.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import WrapElLoading from '@/utils/wrapElLoading'

import App from './App.vue'
import router from './router'
import i18n from '@/lang/i18n'
import UUID from 'vue3-uuid';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { InstallCodemirro } from "codemirror-editor-vue3"

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(WrapElLoading)
app.use(UUID)
app.use(i18n)
app.use(router)
app.use(InstallCodemirro)

app.mount('#app')
