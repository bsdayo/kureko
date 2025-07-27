<template>
  <ToggleGroupItem value="" :data-state="toState(active)" :disabled="disabled">
    <slot />
  </ToggleGroupItem>
</template>

<script lang="ts" setup>
defineProps<{ active?: boolean; disabled?: boolean }>()

function toState(val?: boolean): 'on' | 'off' {
  return val ? 'on' : 'off'
}
</script>
