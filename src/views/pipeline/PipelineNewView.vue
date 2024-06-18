<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'
import { Pipeline } from '@/views/pipeline/PipelineListView'
import WorkFlowView from '@/views/pipeline/workflow/WorkFlowView.vue'
import type { ModelConfigWithStatus } from '@/views/pipeline/workflow/WorkFlowView'
import { ElMessage } from 'element-plus'
import withLoading from '@/utils/loading'
import { Delete } from '@icon-park/vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const id = route.query.id as string
const data = ref<Pipeline.PipelineItem>({
  id: '',
  title: '',
  owner: '',
  createdAt: '',
  updatedAt: '',
  nodes: [],
  edges: []
})

if (id) {
  Pipeline.getPipeline(id).then((res) => {
    data.value = res
  })
}

const test = (v: ModelConfigWithStatus) => {
  console.log(v)
}

const newNodeState = ref({
  id: '',
  label: '',
  uses: 'sleep'
})

const addNode = () => {
  if (!newNodeState.value.label) {
    ElMessage.error('步骤名称不能为空')
    return
  }
  if (!newNodeState.value.uses) {
    ElMessage.error('插件名称不能为空')
    return
  }
  data.value.nodes.push({
    id: uuidv4(),
    label: newNodeState.value.label,
    status: 'pending',
    uses: newNodeState.value.uses,
    params: []
  })

  newNodeState.value = {
    id: '',
    label: '',
    uses: 'sleep'
  }
}

const deleteNode = (id: string) => {
  data.value.nodes = data.value.nodes.filter((item) => item.id !== id)
  data.value.edges = data.value.edges.filter((item) => item.source !== id && item.target !== id)
}

const edgeStart = ref('')
const edgeEnd = ref<string[]>([])
const addEdge = () => {
  const temp = JSON.parse(JSON.stringify(data.value))

  if (!edgeStart.value) {
    ElMessage.error('请选择起点')
    return
  }
  if (!edgeEnd.value.length) {
    ElMessage.error('请选择终点')
    return
  }

  for (const eed of edgeEnd.value) {
    const edge = {
      source: edgeStart.value,
      target: eed,
      status: 'pending'
    }
    const find = temp.edges.find((item) => item.source === edge.source && item.target === edge.target)
    if (find) {
      ElMessage.error(`edge ${find.source} -> ${find.target} already exist`)
      return
    }
    temp.edges.push(edge)

    if (!Pipeline.hasCycle(temp)) {
      data.value.edges.push(edge)
    } else {
      ElMessage.error('cycle is not allowed')
      return
    }
  }

  edgeStart.value = ''
  edgeEnd.value = []
}

const submit = async () => {
  if (!data.value.title) {
    ElMessage.error('流水线名称不能为空')
    return
  }
  if (!id) {
    await withLoading(() => {
      Pipeline.addPipeline({
        title: data.value.title,
        nodes: data.value.nodes,
        edges: data.value.edges,
        owner: data.value.owner
      })
    })
  } else {
    await withLoading(() => {
      Pipeline.updatePipeline({
        id: data.value.id,
        title: data.value.title,
        nodes: data.value.nodes,
        edges: data.value.edges,
        owner: data.value.owner
      })
    })
  }

  await router.push({ name: 'pipelineList' })
}
</script>

<template>
  <div class="flex w-full h-full">
    <div class="w-3/4 h-full flex flex-col gap-4 bg-white dark:bg-slate-800">
      <WorkFlowView class="h-[500px]" v-model:data="data" :on-click-node="test" />
      <div class="flex flex-grow p-4 gap-4">
        <div class="w-full h-full">
          <div class="text-sm font-bold border-l-4 border-sky-400 pl-2">已有步骤管理</div>
          <div class="grid grid-cols-4 gap-4 py-4">
            <div class="p-4 rounded-lg shadow-md flex justify-between items-center" v-for="n in data.nodes" :key="n.id">
              <div>
                <div class="text-sm font-bold">{{ n.label }}</div>
                <div class="text-xs text-gray-500">{{ n.uses }}</div>
              </div>
              <div>
                <delete style="color: #f56c6c" @click="deleteNode(n.id)" />
              </div>
            </div>
          </div>
          <div class="text-sm font-bold border-l-4 border-sky-400 pl-2">已有关系管理</div>
          <div class="grid grid-cols-4 gap-4 py-4">
            <div class="p-4 rounded-lg shadow-md flex justify-between items-center" v-for="n in data.edges" :key="n">
              <div>
                <div class="text-sm font-bold">{{ data.nodes.find((item) => item.id === n.source)?.label }} -> {{ data.nodes.find((item) => item.id === n.target)?.label }} </div>
<!--                <div class="text-xs text-gray-500">{{ // n.uses }}</div>-->
              </div>
              <div>
                <delete style="color: #f56c6c" @click="data.edges = data.edges.filter((item) => item.source !== n.source || item.target !== n.target)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/4 h-full bg-sky-50 p-4 flex flex-col gap-4">
      <div class="bg-sky-100 p-4 rounded-lg flex flex-col gap-2">
        <div class="text-sm font-bold border-l-4 border-sky-400 pl-2">基础信息</div>
        <a-form :model="data" layout="vertical">
          <a-form-item label="流水线名称">
            <a-input v-model:value="data.title" />
          </a-form-item>
          <a-form-item label="所有者">
            <a-input v-model:value="data.owner" />
          </a-form-item>
        </a-form>
      </div>
      <div class="bg-sky-100 p-4 rounded-lg flex flex-col gap-2">
        <div class="text-sm font-bold border-l-4 border-sky-400 pl-2">新增步骤</div>
        <a-form :model="newNodeState" layout="vertical">
          <a-form-item label="步骤名称">
            <a-input v-model:value="newNodeState.label" />
          </a-form-item>
          <a-form-item label="插件名称">
            <a-input v-model:value="newNodeState.uses" />
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 0 }">
            <a-button type="primary" @click="addNode">新增</a-button>
            <a-button style="margin-left: 10px">取消</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="bg-sky-100 p-4 rounded-lg flex flex-col gap-2">
        <div class="text-sm font-bold border-l-4 border-sky-400 pl-2">新增关系</div>
        <a-form layout="vertical">
          <a-form-item label="起点">
            <a-select
              ref="select"
              v-model:value="edgeStart"
            >
              <a-select-option v-for="item in data.nodes" :key="item.id" :value="item.id">{{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="终点">
            <a-select
              ref="select"
              mode="multiple"
              v-model:value="edgeEnd"
            >
              <a-select-option v-for="item in data.nodes" :key="item.id" :value="item.id">{{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 0 }">
            <a-button type="primary" @click="addEdge">新增</a-button>
            <a-button style="margin-left: 10px">取消</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div>
        <a-button type="primary" @click="submit">提交</a-button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>