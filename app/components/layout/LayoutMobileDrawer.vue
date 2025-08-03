<template>
  <Drawer v-model:open="open">
    <DrawerTrigger as-child>
      <Button class="sm:hidden" variant="ghost" size="icon">
        <Menu />
      </Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle></DrawerTitle>
        <DrawerDescription></DrawerDescription>
      </DrawerHeader>
      <div class="grid grid-cols-2 justify-items-start p-4 gap-4">
        <NuxtLink to="/" @click="() => open = false">
          <Button variant="link">首页</Button>
        </NuxtLink>
        <NuxtLink to="/posts/" @click="() => open = false">
          <Button variant="link">文章</Button>
        </NuxtLink>
      </div>
    </DrawerContent>
  </Drawer>
</template>

<script lang="ts" setup>
import { Menu } from 'lucide-vue-next'

const open = ref(false)
</script>
