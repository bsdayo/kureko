<template>
  <NuxtLink href="/" class="block w-fit">
    <Avatar ref="avatarRef" class="size-10">
      <AvatarImage :src="kurekoConfig?.author.avatarUrl ?? ''" :alt="kurekoConfig?.author.name" />
      <AvatarFallback>{{ kurekoConfig?.author.name.slice(0, 2).toUpperCase() }}</AvatarFallback>
    </Avatar>
  </NuxtLink>
</template>

<script lang="ts" setup>
const avatarRef = useTemplateRef<HTMLElement>('avatarRef')
const kurekoConfig = useKurekoConfig()
</script>
