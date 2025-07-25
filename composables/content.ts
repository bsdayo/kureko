import { renderToHTMLString } from '@tiptap/static-renderer/pm/html-string'
import type { Content } from './pocketbase'
import { contentEditorExtensions } from '~/editor'
import type { WatchStopHandle } from 'vue'

export function useContentState() {
  return useState<Content | null>('content')
}

export function useContent(filter: string) {
  const pb = usePocketBase()
  const state = useContentState()

  const { data, status, pending, error } = useAsyncData(`content:${filter}`, async () => {
    // Simulate loading delay
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    return await pb.collection('contents').getFirstListItem(filter)
  })

  const html = computed(() => {
    if (!data.value?.content) return ''
    return renderToHTMLString({
      content: data.value.content,
      extensions: contentEditorExtensions(),
    })
  })

  let unsync: WatchStopHandle
  onMounted(() => {
    unsync = watch(
      () => data.value,
      (newData) => {
        state.value = newData
      },
      { immediate: true }
    )
  })
  onBeforeUnmount(() => {
    unsync()
    state.value = null
  })

  return { content: data, status, pending, error, html }
}
