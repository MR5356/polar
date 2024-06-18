import axios from '@/utils/request'

export namespace Host {
  export interface HostInfo {
    host: string;
    port: number;
    username: string;
    password: string;
  }

  export interface MetaInfo {
    os: string;
    kernel: string;
    hostname: string;
    arch: string;
    cpu: string;
    mem: string;
  }

  export interface HostItem {
    id: string;
    title: string;
    desc: string;
    hostInfo: HostInfo;
    metaInfo: MetaInfo;
    group: Group;
    groupId: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface Group {
    id: string;
    title: string;
    hosts: HostItem[];
    createdAt: string;
    updatedAt: string;
  }

  export const getHosts = function (groupId: string = ''): Promise<HostItem[]> {
    return axios.get('/host/list?groupId=' + groupId)
  }
  
  export const getGroups = function(): Promise<Group[]> {
    return axios.get('/host/group/list')
  }
}
