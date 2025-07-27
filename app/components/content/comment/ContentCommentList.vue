<template>
  <div>
    <ul>
      <li v-if="commentsLoading" v-for="_ in 3" class="mt-4 rounded-lg border px-4 py-3 bg-card">
        <div class="flex gap-2 items-center text-sm">
          <Skeleton class="rounded-full size-8" />
          <Skeleton class="rounded w-16 h-6" />
          <Skeleton class="rounded w-32 h-6" />
        </div>
        <div>
          <Skeleton class="mt-2 rounded max-w-100 h-5" />
          <Skeleton class="mt-2 rounded max-w-80 h-5" />
        </div>
      </li>
    </ul>

    <div
      v-if="!commentsLoading && renderedComments.length === 0"
      class="flex justify-center items-center text-muted-foreground h-32"
    >
      还没有评论哦
    </div>
    <ul class="comment-list" v-else-if="!commentsLoading">
      <li
        v-for="comment in renderedComments"
        class="relative mt-4 rounded-lg border px-4 py-3 bg-card text-card-foreground"
        :style="`margin-left: calc(24px * ${comment.level})`"
      >
        <CornerLeftUp
          v-if="comment.level > 0"
          class="text-muted-foreground opacity-30 absolute top-0 -left-6 size-4"
        />

        <div class="flex gap-2 items-center text-sm">
          <Avatar>
            <AvatarImage v-if="comment.expand?.author" :src="comment.expand.author.avatar" />
            <AvatarFallback>{{ comment.expand?.author?.name.slice(0, 2) }}</AvatarFallback>
          </Avatar>

          <a
            v-if="comment.expand?.author?.website"
            :href="comment.expand.author.website"
            class="font-bold underline-offset-4 hover:underline"
          >
            {{ comment.expand?.author?.name }}
          </a>
          <span v-else class="font-bold">
            {{ comment.expand?.author?.name }}
          </span>

          <Badge variant="outline" v-if="comment.expand?.author?.owner">站长</Badge>

          <span class="text-muted-foreground">
            {{ dayjs(comment.created).format('YYYY 年 MM 月 DD 日') }}
          </span>

          <div class="grow-1" />

          <Button
            variant="ghost"
            size="icon"
            @click="() => (comment.showReplyEditor = !comment.showReplyEditor)"
          >
            <Reply />
          </Button>
        </div>

        <div class="mt-2 prose dark:prose-invert prose-sm max-w-none" v-html="comment.html" />

        <ContentCommentEditor
          v-if="comment.showReplyEditor"
          class="mt-4"
          :content-id="contentId"
          :parent-comment-id="comment.id"
          @comment-submitted="
            () => {
              fetchComments()
              comment.showReplyEditor = false
            }
          "
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import type { Comment } from '#imports'
import { renderToHTMLString } from '@tiptap/static-renderer/pm/html-string'
import { commentEditorExtensions } from '#shared/editor'
import dayjs from 'dayjs'
import { CornerLeftUp, Reply } from 'lucide-vue-next'

const { contentId } = defineProps<{
  contentId?: string
}>()

const pb = usePocketBase()

interface RenderedComment extends Comment {
  html: string
  level: number
  showReplyEditor: boolean
}
const renderedComments = ref<RenderedComment[]>([])
const commentsLoading = ref(false)

async function fetchComments() {
  try {
    commentsLoading.value = true
    const comments = await pb.collection('comments').getFullList({
      filter: `base = "${contentId}"`,
      sort: 'created',
      expand: 'author',
    })

    type RenderedCommentNode = Omit<RenderedComment, 'level'> & {
      children: RenderedCommentNode[]
    }
    const renderedCommentMap: Record<string, RenderedCommentNode> = {}
    const renderedCommentRoot: RenderedCommentNode[] = []

    // Render comments
    for (const comment of comments) {
      renderedCommentMap[comment.id] = {
        ...comment,
        html: renderToHTMLString({
          content: comment.content,
          extensions: commentEditorExtensions({ placeholder: '' }),
        }),
        children: [],
        showReplyEditor: false,
      }
    }

    for (const comment of comments) {
      const child = renderedCommentMap[comment.id]
      if (!child) continue

      if (comment.parent) {
        // If the comment has a parent, add it to the parent's children array
        const parent = renderedCommentMap[comment.parent]
        if (!parent) continue
        parent.children.push(child)
      } else {
        // If the comment has no parent, add it to the root array
        renderedCommentRoot.push(child)
      }
    }

    // Flatten the comment tree into a list with levels
    const result: RenderedComment[] = []
    const append = (children: RenderedCommentNode[], level: number) => {
      for (const node of children) {
        result.push({ ...node, level })
        if (node.children.length > 0) {
          append(node.children, level + 1)
        }
      }
    }
    append(renderedCommentRoot, 0)
    renderedComments.value = result
  } finally {
    commentsLoading.value = false
    nextTick(() => postprocessContent('.comment-list'))
  }
}
watch(() => contentId, fetchComments, { immediate: true })

defineExpose({
  fetchComments,
})
</script>
