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
import { toast } from 'vue-sonner'

const avatarRef = useTemplateRef<HTMLElement>('avatarRef')
const kurekoConfig = useKurekoConfig()

onLongPress(
  avatarRef,
  async () => {
    const pb = usePocketBase()
    try {
      const user = await pb.collection('users').authWithOAuth2({
        provider: 'github',
      })
      toast.success(`欢迎回来，${user?.record.name}。`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '登录失败！')
    }
  },
  {
    delay: 5000,
  }
)
</script>
