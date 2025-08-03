<template>
  <CommandDialog v-model:open="open">
    <CommandInput placeholder="查找内容……" />
    <CommandList></CommandList>
  </CommandDialog>
</template>

<script lang="ts" setup>
const open = defineModel<boolean>()
</script>
