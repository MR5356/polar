import axios, {type Pager} from '@/utils/request'

export interface Repository {
  id: number
  name: string
  owner: string
  ownerID: number
  scmType: string
  description: string
  language: string
  private: boolean
  htmlURL: string
  cloneURL: string
  sshURL: string
  svnURL: string
  installationID: number
  createdAt: string
  updatedAt: string
}

export const listRepositories = async (page: number, size: number): Promise<Pager<Repository>> => {
  return axios.get(`/module/list?page=${page}&size=${size}`)
}
