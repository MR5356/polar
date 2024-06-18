import axios, { Pager } from '@/utils/request'

export namespace Pipeline {
  export interface PipelineItem {
    id?: string
    title: string
    owner: string
    createdAt?: string
    updatedAt?: string
    nodes: WorkflowNode[]
    edges: WorkflowEdge[]
  }

  export interface WorkflowNode {
    id: string
    label: string
    status: string
    uses: string
    params: any[]
  }

  export interface WorkflowEdge {
    source: string
    target: string
    status: string
  }

  export const hasCycle = function (pipelineItem: PipelineItem): boolean {
    const graph: { [key: string]: string[] } = {}
    const visited: { [key: string]: boolean } = {}
    const stack: { [key: string]: boolean } = {}

    // 构建邻接表
    pipelineItem.nodes.forEach(node => {
      graph[node.id] = []
    })

    pipelineItem.edges.forEach(edge => {
      if (graph[edge.source]) {
        graph[edge.source].push(edge.target)
      }
    })

    // 深度优先搜索（DFS）
    const dfs = (node: string): boolean => {
      if (stack[node]) return true // 当前路径中再次遇到该节点，说明存在循环
      if (visited[node]) return false // 该节点已经被访问且不在当前路径中，跳过

      visited[node] = true
      stack[node] = true

      for (const neighbor of graph[node]) {
        if (dfs(neighbor)) return true
      }

      stack[node] = false // 当前节点访问结束，移出当前路径
      return false
    }

    for (const node of Object.keys(graph)) {
      if (dfs(node)) return true
    }

    return false
  }

  export const listPipeline = async (): Promise<PipelineItem[]> => {
    return axios.get<PipelineItem[]>('/pipeline/workflow')
  }

  export const addPipeline = async (data: PipelineItem) => {
    return axios.post('/pipeline/workflow', data)
  }

  export const updatePipeline = async (data: PipelineItem) => {
    return axios.put(`/pipeline/workflow`, data)
  }

  export const getPipeline = async (id: string): Promise<PipelineItem> => {
    return axios.get<PipelineItem>(`/pipeline/workflow/${id}`)
  }

  export const deletePipeline = async (id: string) => {
    return axios.delete(`/pipeline/workflow/${id}`)
  }
}
