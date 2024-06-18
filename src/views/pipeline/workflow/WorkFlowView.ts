// replace object assign
import type { ModelConfig } from '@antv/g6'

export const _extends = Object.assign || function(target: any, ...sources: any[]) {
  for (const source of sources) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

export enum colors {
  begin = '#31B275',
  end = '#31B275',
  success = '#64BB87',
  running = '#E5E5E5',
  waiting = '#aaacb9',
  ready = '#D7E9DC',
  fail = '#CF2227',
  aborted = '#EBDDDE',
  hover = '#9BC5F0'
}

export interface Node {
  id: string
  label: string
  status: string
}
export interface Edge {
  source: string
  target: string
  status: string
}
export interface WorkflowData {
  nodes: Node[]
  edges: Edge[]
}

export const nodeShapeExtraAttrs = {
  begin: {
    stroke: colors.begin,
    fill: colors.begin,
  },
  end: {
    stroke: colors.end,
    fill: colors.end
  },
  success: {
    stroke: colors.success,
    fill: colors.success
  },
  hover: {
    fill: colors.hover
  },
  running: {
    fill: colors.running
  },
  pending: {
    fill: colors.running
  },
  ready: {
    fill: colors.running
  },
  failure: {
    fill: colors.fail
  },
  aborted: {
    fill: colors.aborted
  }
}

export const nodeEdgeExtraAttrs = {
  begin: {
    stroke: colors.success,
  },
  end: {
    stroke: colors.success,
  },
  success: {
    stroke: colors.success,
  },
  running: {
    stroke: colors.success,
    lineDash: [16, 4]
  },
  pending: {
    stroke: colors.running,
  },
  ready: {
    stroke: colors.ready,
    lineDash: [16, 4]
  },
  failure: {
    stroke: colors.fail,
  },
  aborted: {
    stroke: colors.aborted,
  }
}

export const nodeTextExtraAttrs = {
  begin: {
    fontSize: 10,
    text: "Start"
  },
  end: {
    fontSize: 10,
    text: "End",
  },
  success: {
    text: "✓"
  },
  pending: {
    text: ''
  },
  ready: {
    text: ''
  },
  failure: {
    text: "×"
  },
  aborted: {
    text: "-"
  }
}

export interface ModelConfigWithStatus extends ModelConfig {
  status: string
}

