import axios from '@/utils/request'

export namespace User {
  export interface UserItem {
    id: string
    username: string
    nickname: string
    password?: string
    avatar: string
    email: string
    phone: string
    type: number
    status: number
    statusReason: string
    group?: string
    createdAt: string
    updatedAt: string
  }

  export const listUser = async (): Promise<UserItem[]> => {
    return axios.get<UserItem[]>('/user/list')
  }

  export const hasBanned = (status: number): boolean => {
    return status === 2
  }

  export const banUser = async (id: string) => {
    return axios.post(`/user/ban`, { id })
  }

  export const unbanUser = async (id: string) => {
    return axios.post(`/user/unban`, { id })
  }
}