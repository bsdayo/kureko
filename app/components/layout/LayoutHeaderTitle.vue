<template>
  <div v-if="content" class="text-nowrap">
    <div class="text-xs text-muted-foreground overflow-hidden text-ellipsis">
      {{ content.slug }}
    </div>
    <div class="w-full overflow-hidden text-ellipsis">
      {{ content.title }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const content = useContentState()
</script>
