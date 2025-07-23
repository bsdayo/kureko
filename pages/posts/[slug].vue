<template>
  <div class="max-w-prose mx-auto mt-16 mb-4">
    <div class="space-y-2">
      <LayoutHeading>{{ data?.title }}</LayoutHeading>
      <div class="flex gap-4 text-muted-foreground text-sm">
        <div class="flex items-center gap-1">
          <Calendar class="size-4" />
          <span>{{ dayjs(data?.created).format('YYYY 年 M 月 D 日') }}</span>
        </div>
      </div>
    </div>

    <Separator class="mt-4 mb-8" />

    <div class="prose dark:prose-invert" v-html="html" />

    <Separator class="my-8" />

    <ContentCommentEditor
      @comment-submitted="() => commentList?.fetchComments()"
      :content-id="data?.id"
    />
    <ContentCommentList ref="commentList" :content-id="data?.id" />
  </div>
</template>

<script lang="ts" setup>
import { renderToHTMLString } from '@tiptap/static-renderer/pm/html-string'
import dayjs from 'dayjs'
import { Calendar } from 'lucide-vue-next'
import mediumZoom from 'medium-zoom'
import type { WatchStopHandle } from 'vue'
import { contentEditorExtensions } from '~/editor'

const route = useRoute()
const slug = route.params.slug as string

const pb = usePocketBase()
const commentList = useTemplateRef('commentList')

const { data } = useAsyncData(`post:${slug}`, async () => {
  return await pb.collection('contents').getFirstListItem(`slug = "${slug}"`)
})

usePageTitle(computed(() => data.value?.title))

const content = useContentState()
let unsync: WatchStopHandle
onMounted(() => {
  unsync = watch(
    () => data.value,
    (newData) => {
      content.value = newData
    },
    { immediate: true }
  )
})
onUnmounted(() => {
  unsync()
  content.value = null
})

const html = computed(() => {
  if (!data.value?.content) return ''
  return renderToHTMLString({
    content: data.value.content,
    extensions: contentEditorExtensions(),
  })
})

async function postprocess() {
  // Highlight with shiki
  const highlighter = await getOrCreateHighlighter()

  for (const codeBlockEl of document.querySelectorAll('pre > code[class*=language-]')) {
    const pre = codeBlockEl.parentElement
    if (!pre) continue

    const language = codeBlockEl.className.replace('language-', '')
    await loadHighlighterLanguage(language)
    const html = highlighter.codeToHtml(codeBlockEl.textContent || '', {
      lang: language,
      themes: {
        light: 'catppuccin-latte',
        dark: 'catppuccin-mocha',
      },
    })

    pre.insertAdjacentHTML('afterend', html)
    pre.remove()
  }

  // Add labels to images
  for (const figure of document.querySelectorAll('figure')) {
    const img = figure.querySelector('img')
    const caption = figure.querySelector('figcaption')
    if (!img || !caption) continue
    img.setAttribute('alt', caption.textContent || '')
  }
  mediumZoom('.prose img', {
    background: 'rgba(0, 0, 0, 0.5)',
  })
}
onMounted(postprocess) // browser only
watch(() => html.value, postprocess)

// Scroll to anchor
onMounted(() => {
  if (!route.hash) return
  const element = document.getElementById(encodeURIComponent(route.hash.slice(1)))
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
})
</script>
