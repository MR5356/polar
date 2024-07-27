<script setup lang="ts">
import { ref } from 'vue'
import MasonryWall from '@yeger/vue-masonry-wall'
import CPUCard from '../components/CPUCard.vue'
import MEMCard from '../components/MEMCard.vue'
import NetworkCard from '../components/NetworkCard.vue'
import DiskCard from '../components/DiskCard.vue'
import ProcessCard from '@/views/host/components/ProcessCard.vue'

const cpuData = ref({
  percent: 0.5,
  system: 0.02,
  user: 0.4,
  iowait: 0.03,
  steal: 0.05,
  idle: Math.random() / 4,
  children: [
    {
      percent: 0.5,
      system: 0.02,
      user: 0.4,
      idle: Math.random() / 4,
      iowait: 0.03,
      steal: 0.05
    },
    {
      percent: 0.7,
      system: 0.02,
      user: 0.6,
      idle: Math.random() / 4,
      iowait: 0.03,
      steal: 0.05
    }
  ],
  uptime: '10 Day',
  load: '2.02 1.03 3.2'
})
const memData = ref({
  total: 8443543552,
  used: 7443543552,
  free: 3415162880,
  shared: 35389440,
  buffcache: 3748446208,
  available: 7031111680
})
const diskData = ref([
  {
    partition: '/dev/mmcblk0p1',
    size_bytes: 534763520,
    used_size_bytes: 67063808,
    mount_point: '/boot/firmware',
    fs_type: 'vfat',
    read_speed_Bps: 0,
    write_speed_Bps: 0,
    read_iops: 0,
    write_iops: 0,
    read_latency_ms: 0,
    write_latency_ms: 0,
    total_read_bytes: 9305600,
    total_write_bytes: 1536
  },
  {
    partition: '/dev/mmcblk0p2',
    size_bytes: 125348007936,
    used_size_bytes: 7057309696,
    mount_point: '/',
    fs_type: 'ext4',
    read_speed_Bps: 0,
    write_speed_Bps: 299008,
    read_iops: 0,
    write_iops: 30,
    read_latency_ms: 0,
    write_latency_ms: 0,
    total_read_bytes: 1635037184,
    total_write_bytes: 231020683264
  }
])
const networkData = ref([
  {
    name: 'eth0',
    type: 'ethernet',
    bytes_rec: 299008,
    bytes_sent: 1635037184,
    speed_rec: 231020683264,
    speed_sent: 163037184
  },
  {
    name: 'wlp3s0',
    type: 'wifi',
    bytes_rec: 231020683264,
    bytes_sent: 163500037184,
    speed_rec: 231020683264,
    speed_sent: 163037184
  }
])
const processDate = ref([
  {
    cpu: Math.random(),
    mem: Math.random(),
    command: '/usr/lib/systemd/systemd --switched-root --system --deserialize 22'
  },
  {
    cpu: Math.random(),
    mem: Math.random(),
    command: '[kthreadd]'
  },
  {
    cpu: Math.random(),
    mem: Math.random(),
    command: '[kworker/0:0H]'
  },
  {
    cpu: Math.random(),
    mem: Math.random(),
    command: '[rcu_bh]'
  },
  {
    cpu: Math.random(),
    mem: Math.random(),
    command: '[kthreadd]'
  },
  {
    cpu: Math.random(),
    mem: Math.random(),
    command: '[kworker/0:0H]'
  },
  {
    cpu: Math.random(),
    mem: Math.random(),
    command: '[rcu_bh]'
  },
  {
    cpu: Math.random(),
    mem: Math.random(),
    command: '[kthreadd]'
  },
  {
    cpu: Math.random(),
    mem: Math.random(),
    command: '[kworker/0:0H]'
  },
  {
    cpu: Math.random(),
    mem: Math.random(),
    command: '[rcu_bh]'
  },
  {
    cpu: Math.random(),
    mem: Math.random(),
    command: '[kthreadd]'
  },
])
const items = ['cpu', 'mem', 'network', 'disk']
</script>

<template>
  <div class="p-4 flex flex-row gap-4 absolute inset-0 overflow-hidden">
    <masonry-wall class="basis-2/3 overflow-y-auto scroll-none" :items="items" :min-columns="1" :max-columns="3"
                  :gap="16">
      <template #default="{ item }">
        <CPUCard v-if="item==='cpu'" :data="cpuData" />
        <DiskCard v-if="item==='disk'" :data="diskData" />
        <NetworkCard v-if="item==='network'" :data="networkData" />
        <MEMCard v-if="item==='mem'" :data="memData" />
      </template>
    </masonry-wall>
    <div class="basis-1/3 overflow-y-auto scroll-none">
      <ProcessCard :data="processDate" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scroll-none::-webkit-scrollbar {
  display: none;
}
</style>