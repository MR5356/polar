<script setup lang="ts">
import { ref, h } from 'vue'
import { useI18n } from 'vue-i18n'
import numeral from 'numeral'
import moment from 'moment'
import axios from '@/utils/request'
import TableView, { type TableColumn } from '@/components/TableView.vue'

const { t } = useI18n()
const loading = ref(false)
const activeKey = ref('container')

const props = defineProps({
  hostId: {
    type: String,
    required: true
  }
})

interface ContainerItem {
  id: string
  name: string
  image: string
  imageId: string
  command: string
  created: number
  ports: any[]
  status: string
  state: string
  networkMode: string
  mounts: any[]
  runtime: string
}

interface ImageItem {
  id: string
  labels?: any
  size: number
  name: string
  created: number
}

interface NetworkItem {
  id: string
  name: string
  deiver: string
  ipv6: boolean
  internal: boolean
  scope: string
}

const getNetwork = async (id: string): Promise<NetworkItem[]> => {
  return axios.get<NetworkItem[]>(`/host/container/${id}/network`)
}

const getImage = async (id: string): Promise<ImageItem[]> => {
  return axios.get<ImageItem[]>(`/host/container/${id}/image`)
}

const getContainer = async (id: string): Promise<ContainerItem[]> => {
  return axios.get<ContainerItem[]>(`/host/container/${id}/container`)
}

const onTabChange = async (key: string) => {
  switch (key) {
    case 'container':
      await listContainer()
      break
    case 'image':
      await listImage()
      break
    case 'network':
      await listNetwork()
      break
    default:
      break
  }
}

const containers = ref<ContainerItem[]>([])
const images = ref<ImageItem[]>([])
const networks = ref<NetworkItem[]>()

async function listContainer() {
  loading.value = true
  containers.value = await getContainer(props.hostId)
  loading.value = false
}

async function listImage() {
  loading.value = true
  images.value = await getImage(props.hostId)
  loading.value = false
}

async function listNetwork() {
  loading.value = true
  networks.value = await getNetwork(props.hostId)
  loading.value = false
}

listContainer()

const containerColumns = ref<TableColumn[]>([
  {
    field: 'state',
    label: 'container.table.state',
    fixed: true,
    align: 'left',
    filters: [
      { text: 'running', value: 'running' },
      { text: 'exited', value: 'exited' },
      { text: 'restarting', value: 'restarting' },
      { text: 'created', value: 'created' },
      { text: 'removing', value: 'removing' },
      { text: 'paused', value: 'paused' },
      { text: 'dead', value: 'dead' }
    ],
    filterMethod(value: string, row: any) {
      return row.state === value
    },
    width: 66,
    formatter(row, column, cellValue, index) {
      if (row.state === 'running') {
        return h(
          'div',
          {
            class: 'flex gap-2 items-center'
          },
          [
            h(
              'span',
              {
                class: 'relative flex h-3 w-3 items-center justify-center'
              },
              [
                h('span', {
                  class:
                    'animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'
                }),
                h('span', {
                  class: 'relative inline-flex rounded-full h-3 w-3 bg-green-500'
                })
              ]
            )
            // h('span', { class: 'text-sm' }, cellValue)
          ]
        )
      } else {
        return h(
          'div',
          {
            class: 'flex gap-2 items-center'
          },
          [
            h(
              'span',
              {
                class: 'relative flex h-3 w-3'
              },
              [
                h('span', {
                  class: 'absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75'
                }),
                h('span', {
                  class: 'relative inline-flex rounded-full h-3 w-3 bg-sky-50'
                })
              ]
            )
            // h('span', { class: 'text-sm' }, cellValue)
          ]
        )
      }
    }
  },
  {
    field: 'name',
    label: 'container.table.name',
    align: 'left',
    width: 200
  },
  {
    field: 'image',
    label: 'container.table.image',
    align: 'left'
  },
  {
    field: 'status',
    label: 'container.table.status',
    align: 'left',
    width: 300
  }
])

const networkColumns = ref<TableColumn[]>([
  {
    field: 'name',
    label: 'container.table.name',
    align: 'left'
  },
  {
    field: 'driver',
    label: 'container.table.driver',
    align: 'left'
  },
  {
    field: 'ipv6',
    label: 'container.table.ipv6',
    align: 'left'
  },
  {
    field: 'internal',
    label: 'container.table.internal',
    align: 'left'
  },
  {
    field: 'scope',
    label: 'container.table.scope',
    align: 'left'
  }
])

const imageColumns = ref<TableColumn[]>([
  {
    field: 'name',
    label: 'container.table.name',
    align: 'left',
    formatter(row, column, cellValue, index) {
      return cellValue ? cellValue.split(':')[0] : 'None'
    }
  },
  {
    field: 'name',
    label: 'container.table.label',
    align: 'left',
    formatter(row, column, cellValue, index) {
      return cellValue ? cellValue.split(':')[1] : 'None'
    }
  },
  {
    field: 'size',
    label: 'container.table.size',
    align: 'left',
    width: 150,
    formatter(row, column, cellValue, index) {
      return numeral(cellValue).format('0.00b')
    }
  },
  {
    field: 'created',
    label: 'container.table.created',
    align: 'left',
    width: 200,
    formatter(row, column, cellValue, index) {
      return moment(Number(cellValue) * 1000).format('YYYY-MM-DD HH:mm:ss')
    }
  }
])
</script>

<template>
  <el-container class="w-full h-full bg-white dark:bg-slate-800 rounded-lg">
    <el-header class="border-b-[1px]">
      <div class="px-4 py-2 flex items-center gap-2">
        <div class="w-6 h-6">
          <img
            src="data:image/svg+xml;charset=utf-8;base64,PHN2ZyB0PSIxNzIxMjcwODQzMjQyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjUyMDciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNNTAzLjg5NzgyNSA3NjMuODY4MDdMNjIuODc3MTkzIDUwOS4yMzM0MDRWNzYzLjg2ODA3bDQ0MS4wMjA2MzIgMjU0LjYxNjcwMlY3NjMuODY4MDd6IiBmaWxsPSIjNkQ4QUNBIiBwLWlkPSI1MjA4Ij48L3BhdGg+PHBhdGggZD0iTTI4My4zNzg1MjYgMzgxLjkzNDAzNUw2Mi44NzcxOTMgNTA5LjIzMzQwNCA1MDMuODk3ODI1IDc2My44NjgwN2wyMjAuNTAxMzMzLTEyNy4zMTczMzNMMjgzLjM3ODUyNiAzODEuOTM0MDM1eiIgZmlsbD0iIzI4Mzk2MSIgcC1pZD0iNTIwOSI+PC9wYXRoPjxwYXRoIGQ9Ik0yODMuMzc4NTI2IDM4MS45MzQwMzVMNjIuODc3MTkzIDI1NC42MTY3MDJ2MjM3LjU1MDAzNWwyMjAuNTAxMzMzIDEyNy4yOTkzNjhWMzgxLjkzNDAzNXoiIGZpbGw9IiM2RDhBQ0EiIHAtaWQ9IjUyMTAiPjwvcGF0aD48cGF0aCBkPSJNNzI0LjM5OTE1OCAxMjcuMzE3MzMzTDI4My4zNzg1MjYgMzgxLjkzNDAzNXYyMzcuNTMyMDdsNDQxLjAyMDYzMi0yNTQuNjE2NzAxVjEyNy4zMTczMzN6IiBmaWxsPSIjMzk1NDlGIiBwLWlkPSI1MjExIj48L3BhdGg+PHBhdGggZD0iTTUwMy44OTc4MjUgMEw2Mi44NzcxOTMgMjU0LjYxNjcwMmwyMjAuNTAxMzMzIDEyNy4zMTczMzNMNzI0LjM5OTE1OCAxMjcuMzE3MzMzIDUwMy44OTc4MjUgMHpNOTQ0LjkxODQ1NiA1MDkuMjMzNDA0TDUwMy44OTc4MjUgNzYzLjg2ODA3djI1NC42MTY3MDJMOTQ0LjkxODQ1NiA3NjMuODY4MDdWNTA5LjIzMzQwNHoiIGZpbGw9IiM0NzYyQUYiIHAtaWQ9IjUyMTIiPjwvcGF0aD48cGF0aCBkPSJNOTQ0LjkxODQ1NiAyNTQuNjE2NzAyTDcyNC4zOTkxNTggMzgxLjkzNDAzNXY1MDkuMjMzNDA0bDIyMC41MTkyOTgtMTI3LjI5OTM2OVYyNTQuNjE2NzAyeiIgZmlsbD0iIzQ3NjJBRiIgcC1pZD0iNTIxMyI+PC9wYXRoPjxwYXRoIGQ9Ik04MzQuNjQ5ODI1IDcyOS4wNzAwMzVjMCA3LjE1MDAzNSA0LjM2NTQ3NCAxMC40Mzc2MTQgOS43MTkwMTcgNy4zNDc2NDlsMzUuNjk2MjgxLTIwLjYwNTc1NGM1LjM3MTUwOS0zLjEwNzkzIDkuNzE5MDE4LTExLjQyNTY4NCA5LjcxOTAxNy0xOC41NzU3MTkgMC03LjEzMjA3LTQuMzQ3NTA5LTEwLjQzNzYxNC05LjcxOTAxNy03LjMyOTY4NWwtMzUuNjk2MjgxIDIwLjYwNTc1NWMtNS4zNTM1NDQgMy4wODk5NjUtOS43MTkwMTggMTEuNDA3NzE5LTkuNzE5MDE3IDE4LjU1Nzc1NHpNODM0LjY0OTgyNSA3NzYuODIwNzcyYzAgNy4xMzIwNyA0LjM2NTQ3NCAxMC40Mzc2MTQgOS43MTkwMTcgNy4zMjk2ODRsMzUuNjk2MjgxLTIwLjYwNTc1NGM1LjM3MTUwOS0zLjA4OTk2NSA5LjcxOTAxOC0xMS40MDc3MTkgOS43MTkwMTctMTguNTU3NzU1IDAtNy4xNTAwMzUtNC4zNDc1MDktMTAuNDM3NjE0LTkuNzE5MDE3LTcuMzQ3NjQ5bC0zNS42OTYyODEgMjAuNjIzNzJjLTUuMzUzNTQ0IDMuMDg5OTY1LTkuNzE5MDE4IDExLjQwNzcxOS05LjcxOTAxNyAxOC41NTc3NTR6TTgzNC42NDk4MjUgNjgxLjMzNzI2M2MwIDcuMTUwMDM1IDQuMzY1NDc0IDEwLjQzNzYxNCA5LjcxOTAxNyA3LjMyOTY4NGwzNS42OTYyODEtMjAuNjA1NzU0YzUuMzcxNTA5LTMuMDg5OTY1IDkuNzE5MDE4LTExLjQwNzcxOSA5LjcxOTAxNy0xOC41NTc3NTQgMC03LjE1MDAzNS00LjM0NzUwOS0xMC40Mzc2MTQtOS43MTkwMTctNy4zNDc2NWwtMzUuNjk2MjgxIDIwLjYyMzcyYy01LjM1MzU0NCAzLjA4OTk2NS05LjcxOTAxOCAxMS40MDc3MTktOS43MTkwMTcgMTguNTU3NzU0ek04MzQuNjQ5ODI1IDYzMy41ODY1MjZjMCA3LjE1MDAzNSA0LjM2NTQ3NCAxMC40Mzc2MTQgOS43MTkwMTcgNy4zNDc2NDlsMzUuNjk2MjgxLTIwLjYwNTc1NGM1LjM3MTUwOS0zLjEwNzkzIDkuNzE5MDE4LTExLjQyNTY4NCA5LjcxOTAxNy0xOC41NTc3NTQgMC03LjE1MDAzNS00LjM0NzUwOS0xMC40NTU1NzktOS43MTkwMTctNy4zNDc2NDlsLTM1LjY5NjI4MSAyMC42MDU3NTRjLTUuMzUzNTQ0IDMuMDg5OTY1LTkuNzE5MDE4IDExLjQwNzcxOS05LjcxOTAxNyAxOC41NTc3NTR6TTgzNC42NDk4MjUgNTg1Ljg1Mzc1NGMwIDcuMTUwMDM1IDQuMzY1NDc0IDEwLjQzNzYxNCA5LjcxOTAxNyA3LjMyOTY4NWwzNS42OTYyODEtMjAuNjA1NzU1YzUuMzcxNTA5LTMuMDg5OTY1IDkuNzE5MDE4LTExLjQwNzcxOSA5LjcxOTAxNy0xOC41NTc3NTQgMC03LjE1MDAzNS00LjM0NzUwOS0xMC40Mzc2MTQtOS43MTkwMTctNy4zNDc2NDlsLTM1LjY5NjI4MSAyMC42MjM3MTljLTUuMzUzNTQ0IDMuMDg5OTY1LTkuNzE5MDE4IDExLjQwNzcxOS05LjcxOTAxNyAxOC41NTc3NTR6IiBmaWxsPSIjNEQ3NkY2IiBwLWlkPSI1MjE0Ij48L3BhdGg+PHBhdGggZD0iTTUzOS4wMDEyNjMgNTguMjI0MjgxYy03LjA5NjE0LTQuMDk2LTE3LjgzOTE1OC00LjU0NTEyMy0yMy45ODMxNTgtMC45ODgwNy02LjE0NCAzLjUzOTA4OC01LjM3MTUwOSA5LjczNjk4MiAxLjcyNDYzMiAxMy44MzI5ODJsMjkuNDI2NTI2IDE2Ljk5NDgwN2M3LjA5NjE0IDQuMDk2IDE3LjgzOTE1OCA0LjU0NTEyMyAyMy45ODMxNTggMC45ODgwNyA2LjE0NC0zLjUzOTA4OCA1LjM3MTUwOS05LjczNjk4Mi0xLjcyNDYzMi0xMy44MzI5ODJsLTI5LjQyNjUyNi0xNi45OTQ4MDd6TTQ5Ny42NDYwMzUgODIuMDk5NjQ5Yy03LjA5NjE0LTQuMDk2LTE3LjgzOTE1OC00LjU0NTEyMy0yMy45NjUxOTMtMS4wMDYwMzUtNi4xNDQgMy41NTcwNTMtNS4zNzE1MDkgOS43NTQ5NDcgMS43MDY2NjcgMTMuODUwOTQ3bDI5LjQ0NDQ5MSAxNi45OTQ4MDdjNy4wNzgxNzUgNC4wOTYgMTcuODIxMTkzIDQuNTI3MTU4IDIzLjk2NTE5MyAwLjk4ODA3MSA2LjE0NC0zLjUzOTA4OCA1LjM3MTUwOS05LjczNjk4Mi0xLjcyNDYzMi0xMy44MzI5ODNsLTI5LjQyNjUyNi0xNi45OTQ4MDd6TTM3My42MTYyODEgMTUzLjcwNzc4OWMtNy4wOTYxNC00LjA5Ni0xNy44MzkxNTgtNC41NDUxMjMtMjMuOTgzMTU4LTAuOTg4MDctNi4xNDQgMy41MzkwODgtNS4zNzE1MDkgOS43MzY5ODIgMS43MjQ2MzEgMTMuODMyOTgzbDI5LjQyNjUyNyAxNi45OTQ4MDdjNy4wOTYxNCA0LjA5NiAxNy44MzkxNTggNC41NDUxMjMgMjMuOTgzMTU4IDAuOTg4MDcgNi4xNDQtMy41MzkwODggNS4zNzE1MDktOS43MzY5ODItMS43MjQ2MzItMTMuODMyOTgzbC0yOS40MjY1MjYtMTYuOTk0ODA3ek00MTQuOTUzNTQ0IDEyOS44MzI0MjFjLTcuMDc4MTc1LTQuMDk2LTE3LjgyMTE5My00LjUyNzE1OC0yMy45NjUxOTMtMC45ODgwNy02LjE0NCAzLjUzOTA4OC01LjM3MTUwOSA5Ljc1NDk0NyAxLjcyNDYzMSAxMy44MzI5ODJsMjkuNDI2NTI3IDE2Ljk5NDgwN2M3LjA5NjE0IDQuMDk2IDE3LjgzOTE1OCA0LjU0NTEyMyAyMy45NjUxOTMgMS4wMDYwMzUgNi4xNDQtMy41NTcwNTMgNS4zNzE1MDktOS43NTQ5NDctMS43MDY2NjctMTMuODUwOTQ3bC0yOS40NDQ0OTEtMTYuOTk0ODA3ek00NTYuMzA4NzcyIDEwNS45NzUwMThjLTcuMDk2MTQtNC4wOTYtMTcuODM5MTU4LTQuNTQ1MTIzLTIzLjk4MzE1OC0xLjAwNjAzNi02LjE0NCAzLjU1NzA1My01LjM3MTUwOSA5Ljc1NDk0NyAxLjcyNDYzMiAxMy44NTA5NDhsMjkuNDI2NTI2IDE2Ljk5NDgwN2M3LjA5NjE0IDQuMDc4MDM1IDE3LjgzOTE1OCA0LjUyNzE1OCAyMy45ODMxNTggMC45ODgwNyA2LjE0NC0zLjUzOTA4OCA1LjM3MTUwOS05Ljc1NDk0Ny0xLjcyNDYzMi0xMy44NTA5NDdMNDU2LjMwODc3MiAxMDUuOTc1MDE4eiIgZmlsbD0iIzNGQUFGMyIgcC1pZD0iNTIxNSI+PC9wYXRoPjxwYXRoIGQ9Ik0xMTguMDExNTA5IDY4MS4wMTM4OTVjMC02Ljk3MDM4Ni00LjI1NzY4NC0xNS4wOTA1MjYtOS40ODU0NzQtMTguMTA4NjMyLTUuMjQ1NzU0LTMuMDE4MTA1LTkuNDg1NDc0IDAuMTk3NjE0LTkuNDg1NDc0IDcuMTY4djM4LjM3MzA1M2MwIDYuOTcwMzg2IDQuMjM5NzE5IDE1LjA5MDUyNiA5LjQ4NTQ3NCAxOC4xMDg2MzEgNS4yMjc3ODkgMy4wMTgxMDUgOS40ODU0NzQtMC4xNzk2NDkgOS40ODU0NzQtNy4xNjh2LTM4LjM3MzA1MnpNMjgzLjM3ODUyNiA3NzYuNDk3NDA0YzAtNi45NzAzODYtNC4yMzk3MTktMTUuMDkwNTI2LTkuNDY3NTA4LTE4LjEwODYzMi01LjI0NTc1NC0zLjAxODEwNS05LjQ4NTQ3NCAwLjE5NzYxNC05LjQ4NTQ3NCA3LjE2OHYzOC4zNzMwNTNjMCA2Ljk3MDM4NiA0LjIzOTcxOSAxNS4wOTA1MjYgOS40ODU0NzQgMTguMTA4NjMxIDUuMjI3Nzg5IDMuMDE4MTA1IDkuNDY3NTA5LTAuMTc5NjQ5IDkuNDY3NTA4LTcuMTY4di0zOC4zNzMwNTJ6TTE1OS4zNDg3NzIgNzA0Ljg4OTI2M2MwLTYuOTcwMzg2LTQuMjM5NzE5LTE1LjA5MDUyNi05LjQ4NTQ3NC0xOC4xMDg2MzEtNS4yMjc3ODktMy4wMTgxMDUtOS40ODU0NzQgMC4xNzk2NDktOS40ODU0NzMgNy4xNjh2MzguMzczMDUyYzAgNi45NzAzODYgNC4yNTc2ODQgMTUuMDkwNTI2IDkuNDg1NDczIDE4LjEwODYzMiA1LjI0NTc1NCAzLjAxODEwNSA5LjQ4NTQ3NC0wLjE5NzYxNCA5LjQ4NTQ3NC03LjE2OHYtMzguMzczMDUzek0yMDAuNjg2MDM1IDcyOC43NjQ2MzJjMC02Ljk3MDM4Ni00LjIzOTcxOS0xNS4wOTA1MjYtOS40Njc1MDktMTguMTI2NTk3LTUuMjQ1NzU0LTMuMDE4MTA1LTkuNDg1NDc0IDAuMTk3NjE0LTkuNDg1NDczIDcuMTY4djM4LjM3MzA1M2MwIDYuOTg4MzUxIDQuMjM5NzE5IDE1LjEwODQ5MSA5LjQ4NTQ3MyAxOC4xMjY1OTYgNS4yMjc3ODkgMy4wMTgxMDUgOS40Njc1MDktMC4xOTc2MTQgOS40Njc1MDktNy4xNjh2LTM4LjM3MzA1MnpNMjQyLjA0MTI2MyA3NTIuNjRjMC02Ljk4ODM1MS00LjI1NzY4NC0xNS4xMDg0OTEtOS40ODU0NzQtMTguMTI2NTk2LTUuMjI3Nzg5LTMuMDE4MTA1LTkuNDg1NDc0IDAuMTk3NjE0LTkuNDg1NDczIDcuMTY4djM4LjM3MzA1MmMwIDYuOTcwMzg2IDQuMjU3Njg0IDE1LjA5MDUyNiA5LjQ4NTQ3MyAxOC4xMjY1OTcgNS4yMjc3ODkgMy4wMTgxMDUgOS40ODU0NzQtMC4xOTc2MTQgOS40ODU0NzQtNy4xNjh2LTM4LjM3MzA1M3oiIGZpbGw9IiM3MkRGRkYiIHAtaWQ9IjUyMTYiPjwvcGF0aD48cGF0aCBkPSJNNzM4LjM3NTg2IDEzNS4zODM1NzlsLTIyMC41MDEzMzQgMTI3LjI5OTM2OCAyMDYuNTI0NjMyIDExOS4yNTEwODggMjIwLjUxOTI5OC0xMjcuMzE3MzMzLTIwNi41NDI1OTYtMTE5LjIzMzEyM3oiIGZpbGw9IiM0NzYyQUYiIHAtaWQ9IjUyMTciPjwvcGF0aD48cGF0aCBkPSJNNzI0LjM5OTE1OCAzODEuOTM0MDM1bC0yMDYuNTI0NjMyLTExOS4yNTEwODh2MjU0LjYzNDY2N2wyMDYuNTI0NjMyIDExOS4yMzMxMjNWMzgxLjkzNDAzNXoiIGZpbGw9IiM2RDhBQ0EiIHAtaWQ9IjUyMTgiPjwvcGF0aD48cGF0aCBkPSJNNTAzLjg5NzgyNSA1MDkuMjMzNDA0bC0xMzMuNzMwODA3LTc3LjE5NTIyOXYxNTQuNDA4NDIxbDEzMy43MzA4MDcgNzcuMjEzMTkzdi0xNTQuNDI2Mzg1eiIgZmlsbD0iIzQwREVGMSIgcC1pZD0iNTIxOSI+PC9wYXRoPjxwYXRoIGQ9Ik02MzcuNjEwNjY3IDQzMi4wMzgxNzVsLTEzMy43MTI4NDIgNzcuMTk1MjI5djE1NC40MjYzODVsMTMzLjcxMjg0Mi03Ny4yMTMxOTN2LTE1NC40MDg0MjF6IiBmaWxsPSIjNDI2RkZFIiBwLWlkPSI1MjIwIj48L3BhdGg+PHBhdGggZD0iTTUwMy44OTc4MjUgMzU0LjgyNDk4MmwtMTMzLjczMDgwNyA3Ny4yMTMxOTMgMTMzLjczMDgwNyA3Ny4xOTUyMjkgMTMzLjcxMjg0Mi03Ny4xOTUyMjktMTMzLjcxMjg0Mi03Ny4yMTMxOTN6IiBmaWxsPSIjM0ZBQUYzIiBwLWlkPSI1MjIxIj48L3BhdGg+PC9zdmc+"
            alt="logo"
          />
        </div>
        <div class="font-bold text-slate-600">{{ $t('container.title') }}</div>
      </div>
    </el-header>
    <el-container>
      <el-main>
        <div class="py-4 h-full">
          <a-tabs
            class="h-full"
            v-model:activeKey="activeKey"
            tab-position="left"
            animated
            @change="onTabChange"
          >
            <a-tab-pane key="container">
              <template #tab>
                <div class="min-w-[88px] flex items-center gap-2">
                  <div class="w-4 h-4">
                    <img
                      src="data:image/svg+xml;charset=utf-8;base64,PHN2ZyB0PSIxNzIxMjcwOTk2NTc5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjUzNzciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNOTE1LjM1MzYgMzAxLjYxOTJsLTM3MS45NjggMTk2LjI0OTZhNjIuOTI0OCA2Mi45MjQ4IDAgMCAxLTU4LjY3NTIgMEwxMTIuNzkzNiAzMDEuNjE5MmMtMTUuMzYtOC4wMzg0LTIxLjI5OTItMjcuMDg0OC0xMy4yMDk2LTQyLjQ0NDggMi45Njk2LTUuNjMyIDcuNTc3Ni0xMC4yOTEyIDEzLjIwOTYtMTMuMjA5Nkw0ODQuNzYxNiA0OS42NjRhNjIuOTI0OCA2Mi45MjQ4IDAgMCAxIDU4LjY3NTIgMGwzNzEuOTY4IDE5Ni4zMDA4YzE1LjM2IDguMDg5NiAyMS4yNDggMjcuMDg0OCAxMy4xMDcyIDQyLjQ0NDhhMzEuNDExMiAzMS40MTEyIDAgMCAxLTEzLjEwNzIgMTMuMTA3MnoiIGZpbGw9IiM0NUEzRkMiIHAtaWQ9IjUzNzgiPjwvcGF0aD48cGF0aCBkPSJNOTE0Ljc5MDQgMzczLjE0NTZsLTMzOC45OTUyIDE4MS4xNDU2YTYyLjgxNzI4IDYyLjgxNzI4IDAgMCAwLTMzLjIyODggNTYuMzcxMmw1LjIyMjQgMzU2Ljg2NGEzMS40NDcwNCAzMS40NDcwNCAwIDAgMCA0Ni4xMzEyIDI3LjIzODRsMzMzLjc3MjgtMTc2Ljk0NzJjMjAuNTMxMi0xMC45MDU2IDMzLjM4MjQtMzIuMjU2IDMzLjM4MjQtNTUuNTAwOFY0MDAuNzkzNmEzMS40NDE5MiAzMS40NDE5MiAwIDAgMC00Ni4yMzM2LTI3Ljc1MDR6TTExMy4yMDMyIDM3OS45MDRsMzMxLjI2NCAxNzcuNjEyOGMyMC40Mjg4IDEwLjk1NjggMzMuMTc3NiAzMi4yMDQ4IDMzLjE3NzYgNTUuMzk4NHYzNDcuODAxNmMwIDE3LjM1NjgtMTQuMDggMzEuNDM2OC0zMS40MzY4IDMxLjQzNjgtNC45NjY0IDAtOS44MzA0LTEuMTc3Ni0xNC4yMzM2LTMuNDMwNGwtMzMxLjg3ODQtMTY4Ljg1NzZjLTIxLjE0NTYtMTAuNzUyLTM0LjQ1NzYtMzIuNTEyLTM0LjM1NTItNTYuMjE3NmwxLjE3NzYtMzU2LjI0OTZhMzEuNDQxOTIgMzEuNDQxOTIgMCAwIDEgMzEuNTM5Mi0zMS4zMzQ0YzUuMTcxMiAwIDEwLjI0IDEuMjggMTQuNzk2OCAzLjczNzZ6IiBmaWxsPSIjMjQ2QkJBIiBwLWlkPSI1Mzc5Ij48L3BhdGg+PC9zdmc+"
                      alt="logo"
                    />
                  </div>
                  {{ $t('container.navigation.container') }}
                </div>
              </template>
              <div v-loading="loading" class="absolute inset-0 overflow-y-auto px-4">
                <TableView :data="containers" :columns="containerColumns" :operations-width="166">
                  <template #operations="scope">
                    <!-- <el-button size="small" text bg type="primary">
                      {{ $t('container.actions.start') }}
                    </el-button>
                    <el-button size="small" text bg type="danger">
                      {{ $t('container.actions.delete') }}
                    </el-button> -->
                    <el-button
                      size="small"
                      text
                      bg
                      type="primary"
                      disabled
                    >
                      {{ $t('container.actions.log') }}
                    </el-button>
                    <el-button
                      size="small"
                      text
                      bg
                      type="primary"
                      disabled
                    >
                      {{ $t('container.actions.exec') }}
                    </el-button>
                  </template>
                </TableView>
              </div>
            </a-tab-pane>
            <a-tab-pane key="image">
              <template #tab>
                <div class="min-w-[88px] flex items-center gap-2">
                  <div class="w-4 h-4">
                    <img
                      src="data:image/svg+xml;charset=utf-8;base64,PHN2ZyB0PSIxNzIxMjcxMTkwMjAzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEzODczIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTcyOC4xMzU3MyAzODMuNDE5NDUyYy0xNC42MjExOTkgMC0yOC44OTgzNzEgMS4zNzYxMTMtNDIuODMxNTE0IDMuNzg0MzExLTI0LjA4MTk3NS0xMDYuMTMyNzA2LTExOS4yMDU3NzktMTgwLjQ0MjgwMi0yMzIuNTYzMDc3LTE4MC40NDI4MDItMTE3LjY1NzY1MiAwLTIxNS41MzM2OCA4MC41MDI2MDQtMjM0Ljk3MTI3NSAxOTIuNjU1ODA0QzEyOC40OTQ1NDEgNDMzLjk5MTYwMSA2NS4zNjUzNjIgNTIwLjY4NjcxMyA2NS4zNjUzNjIgNjIyLjAwMzAyNGMwIDEzMS43NjI4MDkgMTA2LjgyMDc2MyAyMTEuNzQ5MzcgMjM4LjU4MzU3MSAyMTEuNzQ5MzdoNDI0LjM1ODgxMWMxMzEuNzYyODA5IDAgMjM4LjU4MzU3MS03OS45ODY1NjEgMjM4LjU4MzU3MS0yMTEuNzQ5MzdzLTEwNi45OTI3NzctMjM4LjU4MzU3MS0yMzguNzU1NTg1LTIzOC41ODM1NzJ6IiBmaWxsPSIjNEU5OEVBIiBwLWlkPSIxMzg3NCI+PC9wYXRoPjwvc3ZnPg=="
                      alt="logo"
                    />
                  </div>
                  {{ $t('container.navigation.image') }}
                </div>
              </template>
              <div v-loading="loading" class="absolute inset-0 overflow-y-auto px-4">
                <TableView :data="images" :columns="imageColumns"></TableView>
              </div>
            </a-tab-pane>
            <a-tab-pane key="network">
              <template #tab>
                <div class="min-w-[88px] flex items-center gap-2">
                  <div class="w-4 h-4">
                    <img
                      src="data:image/svg+xml;charset=utf-8;base64,PHN2ZyB0PSIxNzIxMjcxMjY1NzE1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE2MjYzIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTgyMi40IDc2MS42di0zMmgtMTY5LjZ2LTEyNC44SDczNmM5Ni0zLjIgMTY5LjYtODAgMTY5LjYtMTc2IDAtNTEuMi0yMi40LTk2LTU3LjYtMTI4di05LjZjMC0xNDAuOC0xMjEuNi0yNTIuOC0yNjguOC0yNTIuOC02Ny4yIDAtMTMxLjIgMjUuNi0xNzkuMiA2NC0yMi40LTEyLjgtNDQuOC0xOS4yLTcwLjQtMTkuMi04Ni40IDAtMTUzLjYgNzAuNC0xNTMuNiAxNTMuNiAwIDkuNiAwIDE5LjIgMy4yIDI4LjhDMTMxLjIgMzA0IDk2IDM1OC40IDk2IDQyMi40YzAgOTYgNzMuNiAxNzIuOCAxNjYuNCAxODIuNGg5OS4yVjczNkgxOTJ2OTIuOEgxMzQuNHYxNTAuNGgxNTAuNHYtMTUwLjRIMjI0Vjc2OGgxNjkuNnYtMTYzLjJoOTZsMy4yIDIwNC44aC01Ny42Vjk2MGgxNTAuNHYtMTUwLjRoLTYwLjhsLTMuMi0yMDQuOGg5OS4ydjE1Ni44aDE2OS42djYwLjhoLTYwLjh2MTUwLjRoMTUwLjR2LTE1MC40aC01Ny42di02MC44eiIgZmlsbD0iIzVCOEZEOSIgcC1pZD0iMTYyNjQiPjwvcGF0aD48cGF0aCBkPSJNNzU1LjIgODQ4aDk5LjJ2OTkuMmgtOTkuMnoiIGZpbGw9IiNGRTZENjgiIHAtaWQ9IjE2MjY1Ij48L3BhdGg+PHBhdGggZD0iTTQ2MC44IDg0MS42aDg5LjZ2ODkuNmgtODkuNnoiIGZpbGw9IiNGOUQ2NUQiIHAtaWQ9IjE2MjY2Ij48L3BhdGg+PHBhdGggZD0iTTE2My4yIDg1Ny42aDg5LjZ2ODkuNkgxNjMuMnoiIGZpbGw9IiM2OEQyNzkiIHAtaWQ9IjE2MjY3Ij48L3BhdGg+PHBhdGggZD0iTTcyNi40IDI5Ny42SDI4OGMtNi40IDAtMTIuOC05LjYtMTIuOC0xNnYtMy4yYzAtOS42IDYuNC0xNiAxNi0xNmg0MzguNGM5LjYgMCAxNiA2LjQgMTYgMTZ2My4yYy0zLjIgNi40LTEyLjggMTYtMTkuMiAxNnpNNzIwIDQwMEgyOTQuNGMtOS42IDAtMTYtNi40LTE2LTE2czYuNC0xNiAxNi0xNmg0MjIuNGM5LjYgMCAxNiA2LjQgMTYgMTZzLTYuNCAxNi0xMi44IDE2ek03MjAgNTA1LjZIMjk0LjRjLTkuNiAwLTE2LTYuNC0xNi0xNnM2LjQtMTYgMTYtMTZoNDIyLjRjOS42IDAgMTYgNi40IDE2IDE2cy02LjQgMTYtMTIuOCAxNnoiIGZpbGw9IiNDQkRFRjQiIHAtaWQ9IjE2MjY4Ij48L3BhdGg+PHBhdGggZD0iTTU3OS4yIDM4NGMtNi40IDAtMTIuOC02LjQtMTIuOC05LjZWMjkxLjJjMC02LjQgNi40LTkuNiA5LjYtOS42aDMuMmM2LjQgMCA5LjYgNi40IDkuNiA5LjZ2ODMuMmMzLjIgNi40LTMuMiA5LjYtOS42IDkuNnpNNDAwIDQ4My4yYy02LjQgMC0xMi44LTYuNC0xMi44LTkuNnYtODBjMC02LjQgNi40LTkuNiA5LjYtOS42IDYuNCAwIDkuNiA2LjQgOS42IDkuNnY4MGMzLjIgMy4yLTMuMiA5LjYtNi40IDkuNnoiIGZpbGw9IiNDQkRFRjQiIHAtaWQ9IjE2MjY5Ij48L3BhdGg+PC9zdmc+"
                      alt="logo"
                    />
                  </div>
                  {{ $t('container.navigation.network') }}
                </div>
              </template>
              <div v-loading="loading" class="absolute inset-0 overflow-y-auto px-4">
                <TableView :data="networks" :columns="networkColumns"></TableView>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
:deep(.ant-tabs-content) {
  height: 100%;
  position: relative;
}
</style>
