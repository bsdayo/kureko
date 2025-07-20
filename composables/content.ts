import type { Content } from './pocketbase'

export function useContentState() {
  return useState<Content | null>('content')
}
