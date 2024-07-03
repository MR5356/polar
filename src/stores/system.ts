import { ref } from 'vue'
import { defineStore } from 'pinia'
import { SystemModels } from '@/layouts/SystemModels'

export const useSystemStore = defineStore('system', () => {
    const website = ref<SystemModels.Website>(SystemModels.defaultWebsite)
    const navigation = ref<SystemModels.Navigation[]>(SystemModels.defaultNavigation)
    const tabs = ref<{ title: string; key: string; fixed?: boolean }[]>([])
    const language = ref<string>('en')

    function setWebsite(value: SystemModels.Website = SystemModels.defaultWebsite) {
      website.value = value
      SystemModels.setWebsite(value)
    }

    function setNavigation(value: SystemModels.Navigation[]) {
      navigation.value = value
    }

    function setLanguage(value: string) {
      language.value = value
    }

    function addTab(value: { title: string; key: string; fixed?: boolean }) {
      if (tabs.value.some(tab => tab.key === value.key)) {
        return
      }
      tabs.value.push(value)
    }

    function removeTab(key: string) {
      tabs.value = tabs.value.filter(tab => tab.key !== key)
    }

    function setTabFixed(key: string, value: boolean) {
      tabs.value = tabs.value.map(tab => {
        if (tab.key === key) {
          tab.fixed = value
        }
        return tab
      })
    }

    return { website, setWebsite, navigation, setNavigation, language, setLanguage, tabs, addTab, removeTab, setTabFixed }
  },
  {
    persist: true
  }
)