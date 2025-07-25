<template>
  <Skeleton v-if="pending" class="h-5 w-36" />
  <div v-else class="flex items-center gap-1">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ pending?: boolean }>()
</script>
