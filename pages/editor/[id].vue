<template>
  <div class="max-w-5xl mx-auto mt-32">
    <div class="grid grid-cols-4 gap-4">
      <div class="col-span-3 space-y-4">
        <div>
          <textarea
            ref="titleTA"
            class="resize-none text-4xl font-extrabold outline-none overflow-visible placeholder:text-muted-foreground/50"
            v-model="title"
            v-bind="titleAttrs"
            rows="1"
            spellcheck="false"
            :placeholder="base?.title || '标题'"
          />
          <div v-if="errors.title" class="text-sm text-destructive">{{ errors.title }}</div>
        </div>

        <div class="grid grid-cols-[auto_1fr] items-center gap-1 text-muted-foreground text-sm">
          <Hash class="size-4" />
          <input
            class="font-mono outline-none placeholder:text-muted-foreground/50"
            v-model="slug"
            v-bind="slugAttrs"
            :placeholder="base?.slug || 'slug'"
          />
          <div v-if="errors.slug" class="col-start-2 text-destructive">{{ errors.slug }}</div>
        </div>
      </div>
      <div class="flex gap-2 justify-end">
        <EditorDeleteDialog :draft-id="draftId" />
        <EditorInspectDialog :editor="editor" />
        <EditorPublishOrUpdateDialog :base-id="base?.id" :draft-id="draftId" />
      </div>
    </div>

    <Separator class="mt-4 mb-8" />

    <div class="grid grid-cols-4 items-start gap-4">
      <EditorContent class="col-span-3" :editor="editor" spellcheck="false" />

      <div class="sticky top-16 grid gap-4">
        <EditorControls wrap mode="full" :editor="editor" :draft-id="draftId" />
        <ContentToc :content="editorJson" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Editor, EditorContent } from '@tiptap/vue-3'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { watchThrottled, useTextareaAutosize } from '@vueuse/core'
import type { WatchStopHandle } from 'vue'
import { Hash } from 'lucide-vue-next'
import { contentEditorExtensions } from '~/editor'

const draftId = useRoute().params.id as string
const pb = usePocketBase()

const { defineField, setValues, meta, errors } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      title: z
        .string()
        .nonempty()
        .and(z.custom((val) => val && !val.includes('\n'), 'Line breaks are not allowed')),
      slug: z.string().nonempty().regex(SLUG_REGEX),
    })
  ),
})
const [title, titleAttrs] = defineField('title')
const [slug, slugAttrs] = defineField('slug')

usePageTitle(computed(() => '编辑：' + title.value))

const { textarea: titleTA, input: titleTAInput } = useTextareaAutosize()
watch(
  () => title.value,
  (title) => {
    titleTAInput.value = title ?? ''
  }
)

const editor = ref<Editor>()
const editorJson = ref<any>()
const base = ref<Content>()
const contentDirty = ref(false)

onMounted(async () => {
  const draft = await pb.collection('drafts').getOne(draftId, { expand: 'base' })
  base.value = draft.expand?.base as Content | undefined

  setValues(draft)
  editor.value = new Editor({
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none outline-none min-h-[500px]',
      },
    },
    content: draft.content,
    extensions: contentEditorExtensions(),
  })
  editorJson.value = draft.content
  editor.value.on('update', ({ editor }) => {
    contentDirty.value = true
    editorJson.value = editor.getJSON()
  })
})
onBeforeUnmount(() => {
  editor.value?.destroy()
})

// Auto-save content
let stopWatchingContent: WatchStopHandle
onMounted(() => {
  stopWatchingContent = watchThrottled(
    () => contentDirty.value,
    async (dirty) => {
      if (dirty && editor.value) {
        await pb.collection('drafts').update(draftId, {
          content: editor.value.getJSON(),
        })
        console.log('Content auto-saved.')
        contentDirty.value = false
      }
    },
    { throttle: AUTOSAVE_INTERVAL }
  )
})
onBeforeUnmount(() => stopWatchingContent())

// Auto-save metadata
let stopWatchingMetadata: WatchStopHandle
onMounted(() => {
  stopWatchingMetadata = watchThrottled(
    () => meta.value,
    async (meta) => {
      if (meta.touched && !meta.pending && meta.valid) {
        await pb.collection('drafts').update(draftId, {
          title: title.value,
          slug: slug.value,
        })
        console.log('Metadata auto-saved.')
      }
    },
    { throttle: AUTOSAVE_INTERVAL }
  )
})
onBeforeUnmount(() => stopWatchingMetadata())
</script>
