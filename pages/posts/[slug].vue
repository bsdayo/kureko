<template>
  <div class="max-w-prose mx-auto pt-16 pb-4">
    <div class="space-y-2">
      <LayoutHeading>{{ content?.title }}</LayoutHeading>
      <div class="flex gap-4 text-muted-foreground text-sm">
        <div class="flex items-center gap-1">
          <Calendar class="size-4" />
          <span>{{ dayjs(content?.created).format('YYYY 年 M 月 D 日') }}</span>
        </div>
      </div>
    </div>

    <Separator class="mt-4 mb-8" />

    <div class="prose dark:prose-invert" v-html="html" />

    <Separator class="my-8" />

    <ContentCommentEditor
      @comment-submitted="() => commentList?.fetchComments()"
      :content-id="content?.id"
    />
    <ContentCommentList ref="commentList" :content-id="content?.id" />
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { Calendar } from 'lucide-vue-next'

const route = useRoute()
const slug = route.params.slug as string

const commentList = useTemplateRef('commentList')

const { content, html } = useContent(`slug = "${slug}"`)

usePageTitle(computed(() => content.value?.title))

onMounted(postprocessContent)
</script>
