<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster />
</template>

<script setup lang="ts">
import 'vue-sonner/style.css'

const kurekoConfig = useKurekoConfig()
useHead({
  link: [{ rel: 'icon', href: kurekoConfig.value?.author.avatarUrl }],
})
</script>
