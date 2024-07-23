import { ref, type Ref, type UnwrapRef, watch } from 'vue'
import { useEventSource, type UseEventSourceOptions } from '@vueuse/core'
import { RequestEnums } from '@/utils/request'

function useSSE<T>(
  url: string,
  events?: Array<string>,
  options?: UseEventSourceOptions
): {
  eventSource: Ref<EventSource | null>
  event: Ref<string | null>
  data: Ref<UnwrapRef<T | null>>
  status: Ref<'OPEN' | 'CONNECTING' | 'CLOSED'>
  error: Ref<Event | null>
  close: () => void
} {
  url = `${location.protocol}//${window.location.hostname}:${window.location.port}${RequestEnums.BASEURL}${url.startsWith('/') ? url : `/${url}`}`
  const { eventSource, event, data, status, error, close } = useEventSource(url, events, options)

  const parsedData = ref<T | null>(data.value === null ? null : (JSON.parse(data.value) as T))
  let previousData: string | null = data.value

  watch(data, (newData) => {
    if (newData !== previousData) {
        previousData = newData
        parsedData.value = newData === null ? null : JSON.parse(newData) as UnwrapRef<T>
    }
  })

  return { eventSource, event, data: parsedData, status, error, close }
}

export default useSSE
