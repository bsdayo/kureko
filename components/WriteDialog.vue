<template>
  <CommandDialog v-model:open="open">
    <CommandInput placeholder="搜索草稿..." />
    <CommandList>
      <CommandEmpty>无结果</CommandEmpty>
      <CommandGroup>
        <CommandItem value="new" @select="newContent">
          <Plus />
          <span>新建文章</span>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="草稿">
        <NuxtLink v-for="draft in drafts" :key="draft.id" :href="`/editor/${draft.id}`">
          <CommandItem :value="draft.id" @select="() => (open = false)">
            <NotepadTextDashed />
            <div>
              <div>{{ draft.title }}</div>
              <div class="text-xs text-muted-foreground">
                <!-- {{ dayjs(draft.created).format('YYYY-MM-DD HH:mm:ss') }} -->
                {{ draft.slug }}
              </div>
            </div>
          </CommandItem>
        </NuxtLink>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>

<script setup lang="ts">
import { NotepadTextDashed, Plus } from 'lucide-vue-next'
import dayjs from 'dayjs'

const pb = usePocketBase()

const open = defineModel<boolean>()
const drafts = ref<Draft[]>([])

watch(open, async (val) => {
  if (!val) return
  drafts.value = await pb.collection('drafts').getFullList({
    sort: '-created',
  })
})

async function newContent() {
  const now = dayjs()
  const draft = await pb.collection('drafts').create({
    type: 'post',
    title: '无标题 ' + now.format('YYYY-MM-DD HH:mm:ss'),
    slug: 'untitled-' + now.format('YYYYMMDDHHmmss'),
  })
  await navigateTo('/editor/' + draft.id)
  open.value = false
}
</script>
