<template>
  <Drawer>
    <DrawerTrigger as-child>
      <Button variant="ghost" size="icon">
        <Menu />
      </Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle></DrawerTitle>
        <DrawerDescription></DrawerDescription>
      </DrawerHeader>
      <div class="grid grid-cols-2 justify-items-start p-4 gap-4">
        <NuxtLink to="/">
          <Button variant="link">首页</Button>
        </NuxtLink>
        <NuxtLink to="/posts/">
          <Button variant="link">文章</Button>
        </NuxtLink>
      </div>
    </DrawerContent>
  </Drawer>
</template>

<script lang="ts" setup>
import { Menu } from 'lucide-vue-next'
</script>
