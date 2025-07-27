<template>
  <div v-if="pending" class="space-y-8">
    <div class="space-y-4">
      <Skeleton class="h-5 w-full" />
      <Skeleton class="h-5 w-full" />
      <Skeleton class="h-5 w-[70%]" />
    </div>
    <div class="space-y-4">
      <Skeleton class="h-5 w-full" />
      <Skeleton class="h-5 w-full" />
      <Skeleton class="h-5 w-[70%]" />
    </div>
  </div>
  <div v-else class="prose dark:prose-invert" v-html="html" />
</template>

<script lang="ts" setup>
defineProps<{ pending?: boolean; html: string }>()
</script>
