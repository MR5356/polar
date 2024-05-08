<script setup lang="ts">
import { onMounted, ref } from 'vue'
import G6 from '@antv/g6'
import {
  _extends,
  type ModelConfigWithStatus, nodeEdgeExtraAttrs,
  nodeShapeExtraAttrs,
  nodeTextExtraAttrs
} from '@/views/pipeline/workflow/WorkFlowView'
import { transform } from '@antv/matrix-util/lib/ext'

const mountNode = ref()

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
        fillOpacity: 1
      }, nodeShapeExtraAttrs[cfg.status])
    })
    if (cfg.status === 'running') {
      const loading = group.addShape('circle', {
        attrs: {
          cx: 0,
          cy: 0,
          r: 10,
          fill: 'transparent',
          stroke: '#31B275',
          lineWidth: 3,
          lineDash: [10, 5]
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
        fill: 'black',
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
    const shape = group.get('children')[0] // 顺序根据 draw 时确定
    if (name === 'selected') {
      if (value) {
        shape.attr('fill', '#F6C277')
      } else {
        shape.attr('fill', '#FFD591')
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
        path: [['M', startPoint.x, startPoint.y], ['Q', controlPoint.x + 8, controlPoint.y, centerPoint.x, centerPoint.y], ['T', endPoint.x - 8, endPoint.y], ['L', endPoint.x, endPoint.y]],
        fill: 'transparent',
        stroke: '#5B8FF9',
        strokeOffset: 5,
        lineWidth: 4,
        endArrow: {
          path: 'M 0,0 L 10,-5 L 10,5 Z',
        }
      }, nodeEdgeExtraAttrs[cfg.status]),
      name: 'path-shape'
    })
  },
})

const data = ref({
  nodes: [
    {
      id: 'node1',
      label: 'node1',
      status: 'begin',
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

onMounted(() => {
  const graph = new G6.Graph({
    container: mountNode.value, // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
    height: mountNode.value.height,
    width: mountNode.value.width,
    layout: {
      type: 'dagre',
      rankdir: 'LR'
    },
    modes: {
      default: ['drag-canvas']
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
        lineWidth: 4,
      }
    }
  })

  graph.data(data.value)
  graph.render()
})


</script>

<template>
  <div class="h-[600px] w-[100%]" ref="mountNode"></div>
</template>

<style scoped>

</style>