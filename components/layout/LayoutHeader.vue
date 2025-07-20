<template>
  <div
    class="z-40 sticky top-0 left-0 w-full h-16 border-b border-border bg-background flex items-center justify-center"
  >
    <!-- Desktop -->
    <div class="hidden sm:flex container items-center gap-4 px-4">
      <LayoutHeaderAvatar />

      <div class="grow flex items-center relative">
        <LayoutDesktopNavigationMenu
          class="absolute transition-opacity"
          :style="
            content ? `opacity: ${scrollingUp ? 1 : 0}; z-index: ${scrollingUp ? 1 : 0};` : ''
          "
        />

        <div
          v-if="content"
          class="absolute transition-opacity"
          :style="`opacity: ${scrollingUp ? 0 : 1}; z-index: ${scrollingUp ? 0 : 1};`"
        >
          <div class="text-xs text-muted-foreground">{{ content.slug }}</div>
          <div>{{ content.title }}</div>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <LayoutColorModeDropdown />

        <Button
          v-if="user?.owner"
          variant="ghost"
          size="icon"
          @click="() => (writeDialogOpen = true)"
        >
          <PenSquare />
        </Button>
      </div>

      <!-- <LayoutUserDropdown v-if="user" />
      <Button v-else variant="ghost" size="icon" @click="showLoginDialog">
        <LogIn />
      </Button> -->
    </div>

    <!-- Mobile -->
    <div class="flex sm:hidden w-full px-2">
      <div class="grow-1 flex justify-center items-center">
        <LayoutHeaderAvatar />
      </div>
      <LayoutMobileDrawer />
    </div>
  </div>
  <LoginDialog v-model="loginDialogOpen" />
  <WriteDialog v-model="writeDialogOpen" />
</template>

<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { PenSquare } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const pb = usePocketBase()
const user = useUserState()

const content = useContentState()

const loginDialogOpen = ref(false)
const writeDialogOpen = ref(false)

const { directions, y } = useWindowScroll()
const scrollingUp = ref(false)
watch(
  () => y.value,
  () => {
    if (directions.top) {
      scrollingUp.value = true
    } else if (directions.bottom) {
      scrollingUp.value = false
    }
  }
)

function showLoginDialog() {
  if (pb.authStore.isValid) {
    toast.success('已登录。')
  } else {
    loginDialogOpen.value = true
  }
}
</script>
