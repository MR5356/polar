<script setup lang="ts">
import { ref } from 'vue'
import WorkFlowView from '@/views/pipeline/workflow/WorkFlowView.vue'
import type { ModelConfigWithStatus } from '@/views/pipeline/workflow/WorkFlowView'

const data = ref({
  nodes: [
    {
      id: 'node1',
      label: 'node1',
      status: 'begin'
    },
    {
      id: 'node2',
      label: 'node2',
      status: 'success'
    },
    {
      id: 'node3',
      label: 'node3',
      status: 'success'
    },
    {
      id: 'node4',
      label: 'node4',
      status: 'success'
    },
    {
      id: 'node5',
      label: 'node5',
      status: 'fail'
    },
    {
      id: 'node6',
      label: 'node6',
      status: 'running'
    },
    {
      id: 'node7',
      label: 'node7',
      status: 'waiting'
    },
    {
      id: 'node8',
      label: 'node8',
      status: 'running'
    },
    {
      id: 'node9',
      label: 'node9',
      status: 'waiting'
    },
    {
      id: 'node10',
      label: 'node10',
      status: 'waiting'
    }
  ],
  edges: [
    {
      source: 'node1',
      target: 'node2',
      status: 'success'
    },
    {
      source: 'node2',
      target: 'node3',
      status: 'success'
    },
    {
      source: 'node2',
      target: 'node4',
      status: 'success'
    },
    {
      source: 'node2',
      target: 'node5',
      status: 'fail'
    },
    {
      source: 'node2',
      target: 'node6',
      status: 'success'
    },
    {
      source: 'node5',
      target: 'node7',
      status: 'waiting'
    },
    {
      source: 'node4',
      target: 'node7',
      status: 'waiting'
    },
    {
      source: 'node3',
      target: 'node8',
      status: 'waiting'
    },
    {
      source: 'node6',
      target: 'node7',
      status: 'waiting'
    },
    {
      source: 'node7',
      target: 'node9',
      status: 'waiting'
    },
    {
      source: 'node8',
      target: 'node9',
      status: 'waiting'
    },
    {
      source: 'node9',
      target: 'node10',
      status: 'waiting'
    }
  ]
})

const test = (v: ModelConfigWithStatus) => {
  console.log(v)
}
</script>

<template>
  <div class="w-2/3 h-[500px] bg-white p-2 rounded-lg">
    <WorkFlowView v-model:data="data" :on-click-node="test" />
  </div>
</template>

<style scoped>

</style>