<template>
  <div class="relative border rounded-lg transition-shadow" :class="focusClasses">
    <div class="flex justify-between gap-2 p-2 border-b">
      <EditorControls mode="comment" :editor="editor" />
      <div class="flex gap-2 items-center">
        <ContentCommentFaqDialog />

        <Avatar class="cursor-pointer" v-if="user" @click="showUserInfoForm = !showUserInfoForm">
          <AvatarImage :src="user.avatar"></AvatarImage>
          <AvatarFallback>
            {{ user?.name.slice(0, 2) || 'N/A' }}
          </AvatarFallback>
        </Avatar>

        <Button v-if="user" @click="createComment" :disabled="!editor || editor.isEmpty">
          <SendHorizonal />
          <span>{{ parentCommentId ? '回复' : '评论' }}</span>
        </Button>
        <Button v-else @click="loginWithGitHub">
          <GitHubIcon class="fill-current" />
          <span>登录以{{ parentCommentId ? '回复' : '评论' }}</span>
        </Button>
      </div>
    </div>

    <div
      class="grid transition-[grid-template-rows] overflow-hidden"
      :class="showUserInfoForm ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <ContentCommentUserForm @log-out="() => (showUserInfoForm = false)" />
    </div>

    <div class="min-h-32">
      <div v-if="!editor" class="text-[0.875rem] mt-4 ml-4 text-muted-foreground/50">
        {{ placeholderText }}
      </div>
      <EditorContent :editor="editor" spellcheck="false" />
    </div>
    <span class="absolute right-2 bottom-2 text-muted-foreground text-xs">
      {{ editor?.storage.characterCount.characters() || 0 }} / {{ COMMENT_CHARACTER_LIMIT }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { Editor, EditorContent } from '@tiptap/vue-3'
import { commentEditorExtensions } from '#shared/editor'
import { SendHorizonal } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { GitHubIcon } from 'vue3-simple-icons'

const { contentId, parentCommentId, placeholder } = defineProps<{
  contentId?: string
  parentCommentId?: string
  placeholder?: string
}>()
const emit = defineEmits<{
  (e: 'comment-submitted'): void
}>()

const placeholderText = placeholder || '发表你的评论……'

const pb = usePocketBase()
const user = useUserState()

const editor = ref<Editor>()
const focusClasses = ref('')
onMounted(() => {
  editor.value = new Editor({
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert max-w-none outline-none min-h-32 p-4 dark:bg-input/30 pb-6',
      },
    },
    extensions: commentEditorExtensions({
      placeholder: placeholderText,
    }),
    onFocus() {
      focusClasses.value = 'border-ring ring-ring/50 ring-[3px]'
    },
    onBlur() {
      focusClasses.value = ''
    },
  })
})
onBeforeUnmount(() => {
  editor.value?.destroy()
})

const showUserInfoForm = ref(false)

async function createComment() {
  if (!contentId || !editor.value || !user.value) return
  await pb.collection('comments').create({
    base: contentId,
    author: user.value.id,
    parent: parentCommentId,
    content: editor.value.getJSON(),
  })
  editor.value.commands.clearContent()
  emit('comment-submitted')
  toast.success('评论已' + (parentCommentId ? '回复' : '发布') + '。')
}
</script>
