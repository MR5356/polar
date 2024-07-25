<script lang="ts" setup>
import { ref, shallowReactive } from 'vue'
import LogView from '@/components/LogView.vue'
import useTimer from '@/hooks/useTimer'
import Terminal from '@/components/TerminalView.vue'
import CPUCard from '@/views/host/components/CPUCard.vue'
import MEMCard from '@/views/host/components/MEMCard.vue'
import ColoredProgressBar from '@/components/ColoredProgressBar.vue'
import DiskCard from '@/views/host/components/DiskCard.vue'
import YearlyCountdown from '@/components/YearlyCountdown.vue'

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const logs = ref([])

let i = 1

for (let j = 0; j < 100; j++) {
  logs.value.push({ id: i, level: 'Info', message: `aaaa: ${new Date()}` })
  i++
}

const memData = ref({
  total: 8443543552,
  used: 7443543552,
  free: 3415162880,
  shared: 35389440,
  buffcache: 3748446208,
  available: 7031111680
})

const data = ref({
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

const diskData = ref([
  {
    "partition": "/dev/mmcblk0p1",
    "size_bytes": 534763520,
    "used_size_bytes": 67063808,
    "mount_point": "/boot/firmware",
    "fs_type": "vfat",
    "read_speed_Bps": 0,
    "write_speed_Bps": 0,
    "read_iops": 0,
    "write_iops": 0,
    "read_latency_ms": 0,
    "write_latency_ms": 0,
    "total_read_bytes": 9305600,
    "total_write_bytes": 1536
  }
  ,
  {
    "partition": "/dev/mmcblk0p2",
    "size_bytes": 125348007936,
    "used_size_bytes": 7057309696,
    "mount_point": "/",
    "fs_type": "ext4",
    "read_speed_Bps": 0,
    "write_speed_Bps": 299008,
    "read_iops": 0,
    "write_iops": 30,
    "read_latency_ms": 0,
    "write_latency_ms": 0,
    "total_read_bytes": 1635037184,
    "total_write_bytes": 231020683264
  }
])

const { result, isFirstLoading } = useTimer(async () => {
  diskData.value = [
    {
      "partition": "/dev/mmcblk0p1",
      "size_bytes": 534763520,
      "used_size_bytes": Math.random() *534763520,
      "mount_point": "/boot/firmware",
      "fs_type": "vfat",
      "read_speed_Bps": 0,
      "write_speed_Bps": 0,
      "read_iops": 0,
      "write_iops": 0,
      "read_latency_ms": 0,
      "write_latency_ms": 0,
      "total_read_bytes": Math.random() *9305600,
      "total_write_bytes": Math.random() *1536
    }
    ,
    {
      "partition": "/dev/mmcblk0p2",
      "size_bytes": 125348007936,
      "used_size_bytes": Math.random() *125348007936,
      "mount_point": "/",
      "fs_type": "ext4",
      "read_speed_Bps": 0,
      "write_speed_Bps": Math.random() *299008,
      "read_iops": 0,
      "write_iops": 30,
      "read_latency_ms": 0,
      "write_latency_ms": 0,
      "total_read_bytes": Math.random() *1635037184,
      "total_write_bytes": Math.random() *231020683264
    }
  ]
  memData.value = {
    total: 8443543552,
    used: Math.random() * 1412431872,
    free: Math.random() * 3415162880,
    shared: Math.random() * 35389440,
    buffcache: Math.random() * 3748446208,
    available: Math.random() * 7031111680
  }
  data.value = {
    percent: Math.random(),
    system: Math.random() / 4,
    user: Math.random() / 4,
    iowait: Math.random() / 4,
    steal: Math.random() / 4,
    idle: Math.random() / 4,
    children: [
      {
        percent: Math.random(),
        system: Math.random() / 4,
        user: Math.random() / 4,
        iowait: Math.random() / 4,
        idle: Math.random() / 4,
        steal: Math.random() / 4
      },
      {
        percent: Math.random(),
        system: Math.random() / 4,
        user: Math.random() / 4,
        idle: Math.random() / 4,
        iowait: Math.random() / 4,
        steal: Math.random() / 4
      },
      {
        percent: Math.random(),
        system: Math.random() / 4,
        user: Math.random() / 4,
        idle: Math.random() / 4,
        iowait: Math.random() / 4,
        steal: Math.random() / 4
      },
      {
        percent: Math.random(),
        system: Math.random() / 4,
        user: Math.random() / 4,
        idle: Math.random() / 4,
        iowait: Math.random() / 4,
        steal: Math.random() / 4
      }
    ],
    uptime: '10 Day',
    load: '2.02 1.03 3.2'
  }
  // logs.value.push({ id: i, level: 'Info', message: `aaaa: ${new Date()}` })
  // i++
  // logs.value = [...logs.value]
})

</script>

<template>
  <div class="w-[30%] flex flex-col gap-4 p-4">
    <YearlyCountdown />
    <CPUCard :data="data" />
    <MEMCard :data="memData" />
    <DiskCard :data="diskData" />
  </div>
  <!--  <Terminal class="w-full h-full" uri="/api/v1/host/container/271bb15e-cae7-4a5d-a28b-2da7a75ac3bf/docker/container/bc1ae10c8eb603f9205d220ebfe5657a3b89eb3291b7594220b023746815efea/terminal?user=root"  />-->
  <!-- <div class="w-[800px] h-[300px]">
    <LogView :logs="logs" />
  </div> -->
</template>