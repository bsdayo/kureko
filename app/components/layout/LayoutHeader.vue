<template>
  <div
    class="z-40 sticky top-0 left-0 w-full h-16 border-b border-border bg-background flex items-center justify-center"
  >
    <!-- Desktop -->
    <div class="grid grid-cols-[auto_1fr_auto] container items-center gap-4 px-4">
      <LayoutHeaderAvatar />

      <div class="relative overflow-hidden h-full flex items-center">
        <div
          class="transition-opacity"
          :style="inPost ? `opacity: ${scrollingUp ? 1 : 0}; z-index: ${scrollingUp ? 1 : 0};` : ''"
        >
          <div class="sm:hidden text-lg font-semibold">{{ kurekoConfig?.site.name }}</div>
          <LayoutDesktopNavigationMenu class="hidden sm:block" />
        </div>

        <LayoutHeaderTitle
          v-if="inPost"
          class="absolute top-0 left-0 w-full h-full transition-opacity"
          :style="`opacity: ${scrollingUp ? 0 : 1}; z-index: ${scrollingUp ? 0 : 1};`"
        />
      </div>

      <div class="flex items-center gap-1">
        <Button
          v-if="user?.owner"
          variant="ghost"
          size="icon"
          @click="() => (adminDialogOpen = true)"
        >
          <Command />
        </Button>

        <LayoutColorModeDropdown />
        <LayoutMobileDrawer class="sm:hidden" />
      </div>
    </div>

    <!-- Mobile -->
    <!-- <div class="sm:hidden grid grid-cols-[auto_1fr_auto] items-center w-full px-2 gap-2">
      <LayoutMobileDrawer />
      <div class="relative">
        <LayoutHeaderAvatar
          class="mx-auto transition-opacity"
          :style="inPost ? `opacity: ${aboveTitle ? 1 : 0}; z-index: ${aboveTitle ? 1 : 0};` : ''"
        />
        <LayoutHeaderTitle
          v-if="inPost"
          class="absolute top-0 transition-opacity"
          :style="`opacity: ${aboveTitle ? 0 : 1}; z-index: ${aboveTitle ? 0 : 1};`"
        />
      </div>
      <LayoutColorModeDropdown />
    </div> -->
  </div>
  <DialogSearch v-model="searchDialogOpen" />
  <DialogAdmin v-model="adminDialogOpen" />
</template>

<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { Command } from 'lucide-vue-next'

const user = useUserState()

const content = useContentState()
const kurekoConfig = useKurekoConfig()

const inPost = computed(() => content.value && content.value.type === 'post')

const adminDialogOpen = ref(false)
const searchDialogOpen = ref(false)

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
const aboveTitle = computed(() => y.value < 120)
</script>
