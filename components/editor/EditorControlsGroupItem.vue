<template>
  <ToggleGroupItem value="" :data-state="toState(active)">
    <slot />
  </ToggleGroupItem>
</template>

<script lang="ts" setup>
defineProps<{ active?: boolean }>()

function toState(val?: boolean): 'on' | 'off' {
  return val ? 'on' : 'off'
}
</script>
