<template>
  <CommandDialog v-model:open="open">
    <CommandInput placeholder="做些什么呢？" />
    <CommandList>
      <CommandEmpty class="text-muted-foreground">无结果</CommandEmpty>
      <CommandGroup heading="操作">
        <CommandItem value="create" @select="createDraft">
          <PlusCircle />
          <span>新建草稿</span>
          <span class="hidden">create new write</span>
        </CommandItem>
        <CommandItem v-if="content" value="edit" @select="editContent">
          <PenSquare />
          <span>编辑本文</span>
          <span class="hidden">edit write</span>
        </CommandItem>
        <CommandItem
          value="pocketbase"
          @select="navigateTo(pbAdminUrl, { external: true, open: { target: '_blank' } })"
        >
          <Database />
          <span>前往 PocketBase 管理面板</span>
          <span class="hidden">pb</span>
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
import { Database, NotepadTextDashed, PenSquare, PlusCircle } from 'lucide-vue-next'
import dayjs from 'dayjs'

const pb = usePocketBase()
const content = useContentState()

const open = defineModel<boolean>()
const drafts = ref<Draft[]>([])

const runtimeConfig = useRuntimeConfig()
const pbAdminUrl = new URL('/_/', runtimeConfig.public.pocketbaseUrl).toString()

watch(open, async (val) => {
  if (!val) return
  drafts.value = await pb.collection('drafts').getFullList({
    sort: '-created',
  })
})

async function createDraft() {
  const now = dayjs()
  const draft = await pb.collection('drafts').create({
    type: 'post',
    title: '无标题 ' + now.format('YYYY-MM-DD HH:mm:ss'),
    slug: 'untitled-' + now.format('YYYYMMDDHHmmss'),
  })
  await navigateTo('/editor/' + draft.id)
  open.value = false
}

async function editContent() {
  if (!content.value) return
  console.log(content.value)
  const draft = await pb.collection('drafts').create({
    base: content.value.id,
    type: content.value.type,
    title: content.value.title,
    slug: content.value.slug,
    content: content.value.content,
    images: content.value.images,
  })
  await navigateTo(`/editor/${draft.id}`)
  open.value = false
}
</script>
