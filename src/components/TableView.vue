<script setup lang="ts">

import type { PropType, VNode } from 'vue'
import EmptyImage from '@/assets/empty.svg'

export interface TableColumn {
  field: string
  label: string
  width?: string | number
  fixed?: boolean
  align?: 'left' | 'center' | 'right'
  formatter?: (row: any, column: any, cellValue: any, index: number) => VNode | string
}

defineProps({
  // data: {
  //   type: Array<any>,
  //   require: true
  // },
  columns: {
    type: Array<TableColumn>
  },
  selection: {
    type: Boolean,
    require: false,
    default: false
  },
  loading: {
    type: Boolean,
    require: false,
    default: false
  },
  operationsWidth: {
    type: Number,
    require: false,
  },
  selectChange: Function as PropType<((val: any[]) => void)>,
  handlerEdit: Function as PropType<((val: any) => void)>,
  handlerDelete: Function as PropType<((val: any) => void)>,
  handlerDetail: Function as PropType<((val: any) => void)>,
  onSearch: Function as PropType<any>
})

const search = defineModel('search', { type: String, required: false })
const data = defineModel('data', { type: Array<any>, required: true })
</script>

<template>
  <div class="flex flex-col h-full bg-white dark:bg-transparent">
    <slot name="header" />
    <el-table
      class="bg-red-200"
      ref="multipleTableRef"
      :data="data"
      v-loading="loading"
      :empty-text="$t('table.emptyText')"
      style="width: 100%; height: 100%"
      @selection-change="selectChange"
      :scrollbar-always-on="true"
    >
      <template #empty>
        <el-empty :description="$t('table.emptyText')" :image="EmptyImage" :image-size="280"></el-empty>
      </template>
      <el-table-column v-if="selection" type="selection" width="30" />
      <el-table-column v-for="column in columns" :key="column.field" :property="column.field" :label="$t(column.label)"
                       :width="column.width" :show-overflow-tooltip="true" :align="column.align"
                       :formatter="column.formatter" :fixed="column.fixed" />
      <el-table-column
        v-if="handlerDelete || handlerDetail || handlerEdit"
        :label="$t('table.operations')"
        fixed="right"
        :width="operationsWidth ?? (((handlerEdit ? 1 : 0) + (handlerDetail ? 1 : 0) + (handlerDelete ? 1 : 0)) === 1 ? 84 : ((handlerEdit ? 1 : 0) + (handlerDetail ? 1 : 0) + (handlerDelete ? 1 : 0)) * 76)"
      >
        <template #header>
          <el-input
            v-if="onSearch"
            v-model="search"
            size="small"
            :placeholder="$t('table.searchPlaceholder')"
            clearable
            @keyup.enter="onSearch" />
        </template>
        <template #default="scope">
          <slot name="operations" :row="scope.row">
            <el-button size="small" text bg v-if="handlerDetail" @click="handlerDetail(scope.row)">
              {{ $t('table.detail') }}
            </el-button>
            <el-button size="small" text bg v-if="handlerEdit" @click="handlerEdit(scope.row)">
              {{ $t('table.edit') }}
            </el-button>
            <el-button size="small" text bg type="danger" v-if="handlerDelete" @click="handlerDelete(scope.row)">
              {{ $t('table.delete') }}
            </el-button>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    <slot name="footer" />
  </div>
</template>

<style lang="scss" scoped>
///*最外层透明*/
//::v-deep .el-table,
//::v-deep .el-table__expanded-cell {
//  background-color: #dee4fc !important;
//}
//
///* 表格内背景颜色 */
//::v-deep .el-table th,
//::v-deep .el-table tr,
//::v-deep .el-table td {
//  background-color: #dee4fc !important;
//}

</style>