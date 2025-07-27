<template>
  <Skeleton v-if="pending" class="h-10 w-140" />
  <h1 v-else class="text-4xl font-extrabold">
    <slot />
  </h1>
</template>

<script lang="ts" setup>
defineProps<{ pending?: boolean }>()
</script>
