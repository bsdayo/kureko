<template>
  <LayoutContainer>
    <div class="max-w-prose">
      <ContentHeader>
        <ContentTitle :pending="pending">{{ content?.title }}</ContentTitle>
        <ContentInfoList>
          <ContentInfo :pending="pending">
            <Calendar class="size-4" />
            <span>{{ dayjs(content?.created).format('YYYY 年 M 月 D 日') }}</span>
          </ContentInfo>
        </ContentInfoList>
      </ContentHeader>

      <Separator class="mt-4 mb-8" />

      <ContentContent :pending="pending" :html="html" />

      <Separator class="my-8" />

      <ContentCommentEditor
        @comment-submitted="() => commentList?.fetchComments()"
        :content-id="content?.id"
      />
      <ContentCommentList ref="commentList" :content-id="content?.id" />
    </div>
  </LayoutContainer>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { Calendar } from 'lucide-vue-next'

const route = useRoute()
const slug = route.params.slug as string

const commentList = useTemplateRef('commentList')

const { content, pending, error, html } = useContent(`slug = "${slug}"`)
if (error.value) {
  showError(error.value)
}

usePageTitle(computed(() => content.value?.title))

onMounted(() => postprocessContent('.prose'))
</script>
