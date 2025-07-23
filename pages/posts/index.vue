<template>
  <div class="mx-auto max-w-2xl">
    <!-- <LayoutHeading class="mt-32 mb-8">文章</LayoutHeading> -->
    <div v-for="(posts, year) in groupedPosts">
      {{ year }}
      <div v-for="post in posts" :key="post.id" class="flex justify-between items-center">
        <NuxtLink :to="`/posts/${post.slug}`">
          <Button variant="link">{{ post.title }}</Button>
        </NuxtLink>
        <span class="text-sm text-muted-foreground">
          {{ dayjs(post.created).format('YYYY-MM-DD') }}
        </span>
      </div>
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

const groupedPosts = computed(() => {
  if (!data.value) return null
  const grouped = data.value.reduce((acc, post) => {
    const year = dayjs(post.created).year()
    acc[year] ??= []
    acc[year].push(post)
    return acc
  }, {} as Record<number, Content[]>)
  return grouped
})
</script>
