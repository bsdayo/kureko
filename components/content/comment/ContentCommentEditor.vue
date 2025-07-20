<template>
  <div class="relative border rounded-lg transition-shadow" :class="focusClasses">
    <div class="flex justify-between gap-2 p-2 border-b">
      <EditorControls class="overflow-x-scroll" mode="comment" :editor="editor" />
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
        <Button v-else @click="loginWithGithub" class="fill-current">
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <title>GitHub</title>
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            />
          </svg>
          <span>登录以{{ parentCommentId ? '回复' : '评论' }}</span>
        </Button>
      </div>
    </div>

    <div
      class="grid transition-[grid-template-rows] overflow-hidden"
      :class="showUserInfoForm ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <form
        @submit="submitUserInfo"
        class="overflow-hidden grid sm:grid-cols-[1fr_1fr_auto_auto] gap-2 p-2 border-b"
      >
        <FormField v-slot="{ componentField }" name="name">
          <FormItem class="grid grid-cols-[auto_1fr]">
            <FormLabel class="h-9">
              <IdCard class="size-4" />
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" :placeholder="user?.name" />
            </FormControl>
            <FormMessage class="col-start-2" />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="website">
          <FormItem class="grid grid-cols-[auto_1fr]">
            <FormLabel class="h-9">
              <Link class="size-4" />
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" :placeholder="user?.website || '网站'" />
            </FormControl>
            <FormMessage class="col-start-2" />
          </FormItem>
        </FormField>
        <Button type="submit" class="sm:size-9">
          <Check />
        </Button>

        <Button size="icon" variant="ghost" class="text-destructive-foreground" @click="logOut">
          <LogOut />
        </Button>
      </form>
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
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import z from 'zod'
import { commentEditorExtensions } from '~/editor'
import { SendHorizonal, Check, IdCard, Link, LogOut } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

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

async function loginWithGithub() {
  try {
    const user = await pb.collection('users').authWithOAuth2({
      provider: 'github',
    })
    toast.success(`欢迎回来，${user?.record.name}。`)
  } catch (error) {
    toast.error(error instanceof Error ? error.message : '登录失败！')
  }
}

// Update user info
const showUserInfoForm = ref(false)
const schema = toTypedSchema(
  z.object({
    name: z.string().nonempty(),
    website: z.string().url().optional().or(z.literal('')),
  })
)
const form = useForm({
  validationSchema: schema,
})
const submitUserInfo = form.handleSubmit(async (values) => {
  if (!user.value) return
  const newUserInfo = await pb.collection('users').update(user.value?.id, {
    name: values.name,
    website: values.website || null,
  })
  toast.success('用户信息已更新。')
  user.value = newUserInfo
})

function logOut() {
  showUserInfoForm.value = false
  pb.authStore.clear()
  toast.success('已登出。')
}

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
