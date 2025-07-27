<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon">
        <ColorScheme>
          <Sun v-if="colorMode.preference === 'light'" />
          <Moon v-else-if="colorMode.preference === 'dark'" />
          <SunMoon v-else />
        </ColorScheme>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>主题</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="colorMode.preference = 'system'">跟随系统</DropdownMenuItem>
      <DropdownMenuItem @click="colorMode.preference = 'light'">亮色</DropdownMenuItem>
      <DropdownMenuItem @click="colorMode.preference = 'dark'">暗色</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script lang="ts" setup>
import { Sun, Moon, SunMoon } from 'lucide-vue-next'

const colorMode = useColorMode()
</script>
