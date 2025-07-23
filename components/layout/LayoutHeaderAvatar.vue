<template>
  <HoverCard :open-delay="0">
    <HoverCardTrigger as-child>
      <Avatar ref="avatarRef" class="size-10">
        <AvatarImage :src="kurekoConfig?.author.avatarUrl ?? ''" :alt="kurekoConfig?.author.name" />
        <AvatarFallback>{{ kurekoConfig?.author.name.slice(0, 2).toUpperCase() }}</AvatarFallback>
      </Avatar>
    </HoverCardTrigger>
    <HoverCardContent align="start" :align-offset="-16">
      <span class="font-mono font-bold">{{ kurekoConfig?.author.name }}</span>
    </HoverCardContent>
  </HoverCard>
</template>

<script lang="ts" setup>
import { onLongPress } from '@vueuse/core'

const avatarRef = useTemplateRef<HTMLElement>('avatarRef')
const kurekoConfig = useKurekoConfig()

onLongPress(avatarRef, loginWithGitHub, {
  delay: 5000,
})
</script>
