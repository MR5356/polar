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
}