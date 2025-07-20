<template>
  <div class="mx-auto max-w-2xl">
    <LayoutHeading class="mt-32 mb-8">文章</LayoutHeading>
    <div class="flex justify-between items-center" v-for="post in data" :key="post.id">
      <NuxtLink :to="`/posts/${post.slug}`">
        <Button variant="link">{{ post.title }}</Button>
      </NuxtLink>
      <span class="text-sm text-muted-foreground">
        {{ dayjs(post.created).format('YYYY-MM-DD') }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'

usePageTitle('文章')

const pb = usePocketBase()

const { data } = useAsyncData('posts', async () => {
  return await pb.collection('contents').getFullList({
    sort: '-created',
    filter: 'type = "post"',
  })
})
</script>
