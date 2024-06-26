import axios from '@/utils/request'

export namespace Dashboard {
  export interface StatisticItem {
    name: string
    count: string
    path: string
    icon: string
  }

  export const getStatistics = async (): Promise<StatisticItem[]> => {
    return axios.get<StatisticItem[]>('/system/statistic')
  }
}
