<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NuxtLink to="/" custom v-slot="{ isExactActive, href, navigate }">
          <NavigationMenuLink
            :active="isExactActive"
            :href
            @click="navigate"
            :class="navigationMenuTriggerStyle()"
          >
            首页
          </NavigationMenuLink>
        </NuxtLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NuxtLink to="/posts/" custom v-slot="{ isActive, href, navigate }">
          <NavigationMenuLink
            :active="isActive"
            :href
            @click="navigate"
            :class="navigationMenuTriggerStyle()"
          >
            文章
          </NavigationMenuLink>
        </NuxtLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>

<script lang="ts" setup>
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
</script>
