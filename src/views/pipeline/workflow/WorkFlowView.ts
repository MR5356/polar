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

export const nodeShapeExtraAttrs = {
  begin: {
    stroke: '#31B275',
    fill: '#31B275',
  },
  end: {
    stroke: '#31B275',
    fill: '#31B275'
  },
  success: {
    stroke: '#31B275',
    fill: '#31B275'
  },
  running: {
    fill: 'rgba(255, 255, 255, 0.5)'
  },
  waiting: {
    fill: '#aaacb9'
  },
  fail: {
    fill: '#CF2227'
  }
}

export const nodeEdgeExtraAttrs = {
  begin: {
    stroke: '#31B275',
  },
  end: {
    stroke: '#31B275',
  },
  success: {
    stroke: '#31B275',
  },
  running: {
    stroke: 'rgba(255, 255, 255, 0.5)',
  },
  waiting: {
    stroke: '#aaacb9',
  },
  fail: {
    stroke: '#CF2227',
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

