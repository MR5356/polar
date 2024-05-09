<script setup lang="ts">
import { onMounted, ref, h, type PropType } from 'vue'
import { AutoFocus, Aiming, Clear } from '@icon-park/vue-next'
import G6 from '@antv/g6'
import {
  _extends,
  colors,
  type ModelConfigWithStatus, nodeEdgeExtraAttrs,
  nodeShapeExtraAttrs,
  nodeTextExtraAttrs
} from '@/views/pipeline/workflow/WorkFlowView'
import { transform } from '@antv/matrix-util/lib/ext'

const mountNode = ref()
let graph = null
const data = defineModel('data', { type: Object, required: true })

const props = defineProps({
  onClickNode: {
    type: Function as PropType<((item: ModelConfigWithStatus) => void)>,
    required: true
  }
})

G6.registerNode('node', {
  draw: function drawShape(cfg: ModelConfigWithStatus, group) {
    // return genNodeShape(cfg as ModelConfigWithStatus, group)
    const shape = group.addShape('rect', {
      attrs: _extends({
        x: -14,
        y: -14,
        width: 28,
        height: 28,
        radius: 14,
        fill: 'transparent',
        cursor: 'pointer',
        fillOpacity: 1
      }, nodeShapeExtraAttrs[cfg.status])
    })

    if (cfg.status === 'running') {
      const loading = group.addShape('circle', {
        attrs: {
          cx: 0,
          cy: 0,
          r: 8,
          fill: 'transparent',
          stroke: '#31B275',
          cursor: 'pointer',
          lineWidth: 3,
          lineDash: [8, 2]
        },
        name: 'loading-animation',
        draggable: true
      })
      loading.animate(
        (ratio: number) => {
          const matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1]
          // 目标矩阵
          const toMatrix = transform(matrix, [['r', ratio * Math.PI * 2]])
          // 返回这一帧需要的参数集，本例中只有目标矩阵
          return {
            matrix: toMatrix
          }
        },
        {
          repeat: true, // 动画重复
          duration: 3000,
          easing: 'easeLinear'
        }
      )
    } else {
      group.addShape('text', {
        attrs: _extends({
          x: 0,
          y: 0,
          textAlign: 'center',
          textBaseline: 'middle',
          cursor: 'pointer',
          text: cfg.label,
          fill: 'white',
          fontWeight: 'bold',
          fontSize: 16
        }, nodeTextExtraAttrs[cfg.status]),
        name: 'text-shape',
        draggable: true
      })
    }
    // 标题文本
    group.addShape('text', {
      attrs: _extends({
        x: 0,
        y: -24,
        textAlign: 'center',
        textBaseline: 'middle',
        text: cfg.label,
        fill: '#5B6880',
        fontWeight: 'bold',
        fontSize: 12
      }, {}),
      name: 'text-shape',
      draggable: true
    })
    return shape
  },
  // 设置状态
  setState: function setState(name, value, item) {
    const group = item.getContainer()
    const shape = group.get('children')[0]
    if (name === 'hover' && !item.getStates().includes('click')) {
      if (value) {
        shape.attr('fill', item?._cfg.originStyle?.fill + '99')
      } else {
        shape.attr('fill', item?._cfg.originStyle?.fill || 'transparent')
      }
    } else if (name === 'click') {
      if (value) {
        shape.attr('fill', colors.hover)
      } else {
        shape.attr('fill', item?._cfg.originStyle?.fill || 'transparent')
      }
    }
  },

  getAnchorPoints: function getAnchorPoints() {
    return [[0, 0.5], [1, 0.5]]
  }
}, 'circle')

G6.registerEdge('edge', {
  itemType: 'edge',
  draw(cfg: ModelConfigWithStatus, group) {
    const startPoint = cfg.startPoint
    const endPoint = cfg.endPoint
    const centerPoint = {
      x: (startPoint.x + endPoint.x) / 2,
      y: (startPoint.y + endPoint.y) / 2
    }
    // 控制点坐标
    const controlPoint = {
      x: (startPoint.x + centerPoint.x) / 2,
      y: startPoint.y
    }

    // 为了更好的展示效果, 对称贝塞尔曲线需要连到箭头根部
    return group.addShape('path', {
      attrs: _extends({
        path: [['M', startPoint.x + 2, startPoint.y], ['Q', controlPoint.x + 8, controlPoint.y, centerPoint.x, centerPoint.y], ['T', endPoint.x - 24, endPoint.y], ['L', endPoint.x - 8, endPoint.y]],
        fill: 'transparent',
        stroke: '#5B8FF9',
        strokeOffset: 5,
        lineWidth: 4,
        endArrow: {
          path: 'M 0,0 L 10,-5 L 10,5 Z'
        }
      }, nodeEdgeExtraAttrs[cfg.status]),
      name: 'path-shape'
    })
  }
})

onMounted(async () => {
  const minimap = new G6.Minimap({
    size: [100, 100],
    className: 'g6-minimap',
    type: 'delegate'
  })

  graph = new G6.Graph({
    container: mountNode.value, // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
    height: mountNode.value.height,
    width: mountNode.value.width,
    plugins: [minimap],
    fitView: true,
    fitCenter: true,
    layout: {
      type: 'dagre',
      rankdir: 'LR',
      align: 'UL',
      nodesep: 20
    },
    modes: {
      default: ['drag-canvas', 'zoom-canvas']
    },
    defaultNode: {
      type: 'node',
      size: 24,
      labelCfg: {
        style: {
          fill: 'white',
          fontSize: 12,
          cursor: 'pointer',
          shadowColor: 'green'
        }
      }
    },
    defaultEdge: {
      type: 'edge',
      style: {
        lineWidth: 4
      }
    }
  })

  graph.data(data.value)
  graph.render()

  graph.on('node:mouseenter', function(evt: any) {
    const node = evt.item
    const model = node.getModel()
    model.oriLabel = model.label
    graph.setItemState(node, 'hover', true)
  })
  graph.on('node:mouseleave', function(evt: any) {
    const node = evt.item
    graph.setItemState(node, 'hover', false)
  })

  graph.on('node:click', (e) => {
    // 先将所有当前是 click 状态的节点置为非 click 状态
    const clickNodes = graph.findAllByState('node', 'click')
    clickNodes.forEach((cn) => {
      graph.setItemState(cn, 'click', false)
    })
    const nodeItem = e.item // 获取被点击的节点元素对象
    graph.setItemState(nodeItem, 'click', true) // 设置当前节点的 click 状态为 true
    props.onClickNode(nodeItem.getModel())
  })
})

const clearClickState = () => {
  const clickNodes = graph.findAllByState('node', 'click')
  clickNodes.forEach((cn) => {
    graph.setItemState(cn, 'click', false)
  })
}

const fitView = () => {
  graph.fitView()
}

const fitCenter = () => {
  graph.fitCenter()
}
</script>

<template>
  <div class="relative h-[100%] w-[100%]" ref="mountNode">
    <div class="absolute bottom-1 right-1 flex items-center gap-2">
      <a-tooltip placement="topRight">
        <template #title>{{ $t('pipeline.workflow.fitView') }}</template>
        <a-button class="text-slate-500 opacity-80 border-slate-500 border-[1px]" :icon="h(AutoFocus)" type="text"
                  @click="fitView"></a-button>
      </a-tooltip>
      <a-tooltip placement="topRight">
        <template #title>{{ $t('pipeline.workflow.fitCenter') }}</template>
        <a-button class="text-slate-500 opacity-80 border-slate-500 border-[1px]" :icon="h(Aiming)" type="text"
                  @click="fitCenter"></a-button>
      </a-tooltip>
      <a-tooltip placement="topRight">
        <template #title>{{ $t('pipeline.workflow.clearClickState') }}</template>
        <a-button class="text-slate-500 opacity-80 border-slate-500 border-[1px]" :icon="h(Clear)" type="text"
                  @click="clearClickState"></a-button>
      </a-tooltip>
    </div>
  </div>
</template>

<style>
.g6-minimap {
  position: absolute;
  left: 0.25rem;
  bottom: 0.25rem;
  border-radius: 0.5rem;
  background: rgba(0, 0, 0, 0.1);
}
</style>