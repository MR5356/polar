<script setup lang="ts">
import { ref } from 'vue'

const editableTabsValue = ref('1')
const editableTabs = ref([
  {
    title: '定时任务',
    name: '1',
    closable: true
  },
  {
    title: '执行记录',
    name: '2',
    closable: true
  },
  {
    title: '执行记录',
    name: '3',
    closable: false
  },
  {
    title: '执行记录',
    name: '4',
    closable: true
  },
  {
    title: '其他',
    name: '5',
    closable: true
  }
])
const removeTab = (targetName: string) => {
  console.log(targetName)
}
const activeKey = ref(editableTabs.value[0].key);
</script>

<template>
  <div class="bg-opacity-20 bg-white dark:bg-slate-900">
<!--    <el-tabs-->
<!--      v-model="editableTabsValue"-->
<!--      type="border-card"-->
<!--      @tab-remove="removeTab"-->
<!--    >-->
<!--      <el-tab-pane-->
<!--        v-for="item in editableTabs"-->
<!--        :key="item.name"-->
<!--        :closable="item.closable"-->
<!--        :label="item.title"-->
<!--        :name="item.name"-->
<!--      >-->
<!--      </el-tab-pane>-->
<!--    </el-tabs>-->
    <a-tabs v-model:activeKey="activeKey" type="editable-card" hideAdd :tabBarGutter="8">
      <a-tab-pane v-for="pane in editableTabs" :key="pane.name" :tab="pane.title" :closable="pane.closable">
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin: 0;
  &.ant-tabs-tab {
    border: 0 !important;
  }
}


:deep(.el-tabs__header) {
  background: transparent !important;
  margin: 0;
  border: 0;
  padding: 8px 8px 0 8px;
}

:deep(.el-tabs__item) {
  padding: 0 12px;
  height: 2rem;
  font-weight: normal;
  border: 0;

  &:hover {
    padding: 0 12px;
  }

  &.is-active {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    border: 0;
    //background: transparent !important;
  }
}

:deep(.el-tabs__content) {
  background: transparent !important;
  padding: 0;
}

:deep(.el-tabs--border-card) {
  background: transparent;
  border: 0;
}
</style>