import type { DocumentType } from '@tiptap/core'
import PocketBase, { RecordService } from 'pocketbase'

export type ContentType = 'post'

export interface User {
  id: string
  name: string
  avatar: string
  website?: string
  owner: boolean
  created: string
}

export interface Content {
  id: string
  type: ContentType
  title: string
  slug: string
  content?: DocumentType
  images: string[]
  created: string
  updated: string
}

export interface Draft extends Content {
  base?: string
  expand?: { base?: Content }
}

export interface Image {
  id: string
  file: string
  created: string
  updated: string
}

export interface Comment {
  id: string
  base: string
  author: string
  parent?: string
  content: DocumentType
  created: string
  updated: string
  expand?: {
    base?: Content
    author?: User
  }
}

interface TypedPocketBase extends PocketBase {
  collection(idOrName: string): RecordService
  collection(idOrName: 'users'): RecordService<User>
  collection(idOrName: 'contents'): RecordService<Content>
  collection(idOrName: 'drafts'): RecordService<Draft>
  collection(idOrName: 'images'): RecordService<Image>
  collection(idOrName: 'comments'): RecordService<Comment>
}

let pb: TypedPocketBase | null = null

function updateUserState() {
  const authState = useUserState()
  if (pb?.authStore.isValid) {
    authState.value = pb.authStore.record as unknown as User
  } else {
    authState.value = null
  }
}

export const usePocketBase = () => {
  if (!pb) {
    const config = useRuntimeConfig()
    pb = new PocketBase(config.public.pocketbaseUrl) as TypedPocketBase
    pb.authStore.onChange(updateUserState)
  }
  onMounted(updateUserState)
  return pb
}

export const useUserState = () => {
  return useState<User | null>('user')
}
