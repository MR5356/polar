// replace object assign
import type { Graph, IGroup, IShape, ModelConfig } from '@antv/g6'
import { transform } from '@antv/matrix-util/lib/ext'


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
  fail = '#CF2227',
  hover = '#9BC5F0'
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
  running: {
    fill: colors.running
  },
  waiting: {
    fill: colors.waiting
  },
  fail: {
    fill: colors.fail
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
    stroke: colors.running,
  },
  waiting: {
    stroke: colors.waiting,
  },
  fail: {
    stroke: colors.fail,
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
  waiting: {
    text: ''
  },
  fail: {
    text: "×"
  }
}

export interface ModelConfigWithStatus extends ModelConfig {
  status: string
}

