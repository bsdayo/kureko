<template>
  <div class="mx-auto max-w-prose py-32 space-y-24">
    <div v-if="pending" class="space-y-6">
      <div class="flex justify-between" v-for="_ in 5">
        <Skeleton class="h-5 w-64" />
        <Skeleton class="h-5 w-24" />
      </div>
    </div>
    <div v-else v-for="(posts, year) in groupedPosts" class="relative space-y-6">
      <div class="absolute text-8xl font-bold -top-12 -left-12 -z-10 opacity-10">
        {{ year }}
      </div>
      <div v-for="post in posts" :key="post.id" class="flex justify-between items-center">
        <NuxtLink
          :to="`/posts/${post.slug}`"
          class="text-foreground/70 hover:text-foreground transition-colors"
        >
          {{ post.title }}
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

const { data, pending } = useAsyncData('posts', async () => {
  // Simulate loading delay
  // await new Promise((resolve) => setTimeout(resolve, 1000))
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
