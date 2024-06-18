<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import WorkFlowView from '@/views/pipeline/workflow/WorkFlowView.vue'
import type { ModelConfigWithStatus } from '@/views/pipeline/workflow/WorkFlowView'
import axios from '@/utils/request'
import { Pipeline } from '@/views/pipeline/PipelineListView'
import { useRoute } from 'vue-router'

const route = useRoute()
const interval = ref()

onMounted(() => {
  interval.value = setInterval(detail, 500)
})

onBeforeUnmount(() => {
  clearInterval(interval.value)
})

const data = ref<Pipeline.PipelineItem>({
  id: '',
  title: '',
  owner: '',
  createdAt: '',
  updatedAt: '',
  nodes: [],
  edges: []
})
const rawData = ref<Pipeline.PipelineItem>({
  id: '',
  title: '',
  owner: '',
  createdAt: '',
  updatedAt: '',
  nodes: [],
  edges: []
})

const detail = async () => {
  await Pipeline.getPipeline(route.params.id as string).then((res) => {
    if (JSON.stringify(rawData.value) != JSON.stringify(res)) {
      rawData.value = res
      data.value = JSON.parse(JSON.stringify(res))
    }
  }).catch(() => {
    clearInterval(interval.value)
  })
  // data.value =  await  axios.get('')
}

const start = async () => {
  await axios.get('/start')
}

const reset = async () => {
  await axios.get('/reset')
}

const cancel = async () => {
  await axios.get('/cancel')
}

detail()

const test = (v: ModelConfigWithStatus) => {
  console.log(v)
}
</script>

<template>
  <div class="w-full h-[500px] bg-white p-2 rounded-lg">
    <WorkFlowView :data="data" :on-click-node="test" />
  </div>
  <div class="p-4 float-right">
    <el-button type="primary" @click="start">开始</el-button>
    <el-button type="primary" @click="cancel">终止</el-button>
    <el-button type="primary" @click="reset">重置</el-button>
  </div>
</template>

<style scoped>

</style>