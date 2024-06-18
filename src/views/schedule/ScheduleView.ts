import axios, { Pager } from '@/utils/request'

export namespace Schedule {
  export interface ScheduleItem {
    createdAt: string
    cronString: string
    desc: string
    enabled: boolean
    executor: string
    id: string
    nextTime: string
    params: string
    status: string
    title: string
    updatedAt: string
  }

  export interface ScheduleRecordItem {
    id: string
    scheduleID: string
    title: string
    taskName: string
    params: string
    status: string
    createdAt: string
    updatedAt: string
  }


  export interface Executor {
    name: string
    displayName: string
  }

  export const pageSchedule = async (page: Number, size: Number): Promise<Pager<ScheduleItem>> => {
    return axios.get<Pager<ScheduleItem>>(`/schedule/page?page=${page}&size=${size}`)
  }

  export const pageScheduleRecord = async (page: Number, size: Number): Promise<Pager<ScheduleRecordItem>> => {
    return axios.get<Pager<ScheduleRecordItem>>(`/schedule/record/page?page=${page}&size=${size}`)
  }

  export const deleteSchedule = async (id: string) => {
    return axios.delete(`/schedule/${id}`)
  }

  export const getExecutors = async (): Promise<Executor[]> => {
    return axios.get<Executor[]>(`/schedule/executors`)
  }

  export const updateSchedule = async (data: ScheduleItem) => {
    return axios.put(`/schedule/${data.id}`, data)
  }

  export const batchDeleteSchedule = async (ids: string[]) => {
    return axios.put('/schedule/batch/delete', ids )
  }

  export const batchSetEnabled = async (ids: string[], enabled: boolean) => {
    if (enabled) {
      return axios.put('/schedule/batch/enable', ids)
    } else {
      return axios.put('/schedule/batch/disable', ids)
    }
  }
}