import axios, { Pager } from '@/utils/request'

export namespace Script {
  export interface ScriptItem {
    id: string
    title: string
    desc: string
    content: string
    type: string
    createdAt: string
    updatedAt: string
  }

  export interface ScriptRecordItem {
    id: string
    scriptTitle: string
    script: string
    hosts: string
    params: string
    result: string
    status: string
    message: string
    error: string
    spend?: string
    createdAt: string
    updatedAt: string
  }

  export const pageScript = async (page: Number, size: Number): Promise<Pager<ScriptItem>> => {
    return axios.get<Pager<ScriptItem>>(`/script/page?page=${page}&size=${size}`)
  }

  export const batchDeleteScript = async (ids: string[]) => {
    return axios.put('/script/batch/delete', ids )
  }

  export const addScript = async (data: ScriptItem) => {
    return axios.post('/script', data)
  }

  export const updateScript = async (data: ScriptItem) => {
    return axios.put(`/script`, data)
  }

  export const detailScript = async (id: string): Promise<ScriptItem> => {
    return axios.get(`/script/${id}/detail`)
  }

  export const execScript = async (scriptId: string, hostIds: string[], params: string) => {
    return axios.post(`/script/exec`, { scriptId, hostIds, params })
  }

  export const pageRecord = async (page: Number, size: Number): Promise<Pager<ScriptRecordItem>> => {
    return axios.get<Pager<ScriptItem>>(`/script/exec/record/page?page=${page}&size=${size}`)
  }

  export const stopJob = async (id: string) => {
    return axios.delete(`/script/exec/${id}`)
  }

  export const getJobLog = async (id: string): Promise<Map<string, string[]>> => {
    return axios.get(`/script/exec/${id}/log`)
  }
}