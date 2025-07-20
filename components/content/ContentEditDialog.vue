<template>
  <AlertDialog @update:open="(open) => open && fetchPreviousDrafts()">
    <AlertDialogTrigger as-child>
      <Button v-if="user?.owner">
        <PenSquare />
        <span>编辑</span>
      </Button>
    </AlertDialogTrigger>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>编辑内容</AlertDialogTitle>
        <AlertDialogDescription>进入编辑页面</AlertDialogDescription>
      </AlertDialogHeader>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>标题</TableHead>
            <TableHead>最近更新</TableHead>
            <TableHead>编辑</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="draft in previousDrafts" :key="draft.id">
            <TableCell class="max-w-50 overflow-hidden overflow-ellipsis">
              {{ draft.title }}
            </TableCell>
            <TableCell>{{ dayjs(draft.updated).format('YYYY-MM-DD HH:mm:ss') }}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" @click="() => navigateTo(`/editor/${draft.id}`)">
                <PenSquare />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
        <TableRow v-if="loadingDrafts">
          <TableCell>
            <Skeleton class="w-32 h-4" />
          </TableCell>
          <TableCell>
            <Skeleton class="w-16 h-4" />
          </TableCell>
          <TableCell>
            <Skeleton class="w-16 h-4" />
          </TableCell>
        </TableRow>
        <TableCaption v-if="!loadingDrafts && previousDrafts.length === 0">没有草稿</TableCaption>
      </Table>

      <AlertDialogFooter>
        <AlertDialogCancel>取消</AlertDialogCancel>
        <AlertDialogAction @click="newDraft">新草稿</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script lang="ts" setup>
import { PenSquare } from 'lucide-vue-next'
import dayjs from 'dayjs'

const props = defineProps<{
  content?: Content | null
}>()

const pb = usePocketBase()
const user = useUserState()

const loadingDrafts = ref(false)
const previousDrafts = ref<Draft[]>([])

async function fetchPreviousDrafts() {
  if (!props.content) return
  try {
    loadingDrafts.value = true
    previousDrafts.value = await pb.collection('drafts').getFullList({
      filter: `base = "${props.content.id}" && type = "${props.content.type}"`,
      sort: '-updated',
    })
  } finally {
    loadingDrafts.value = false
  }
}

async function newDraft() {
  if (!props.content) return
  console.log(props.content)
  const draft = await pb.collection('drafts').create({
    base: props.content.id,
    type: props.content.type,
    title: props.content.title,
    slug: props.content.slug,
    content: props.content.content,
    images: props.content.images,
  })
  await navigateTo(`/editor/${draft.id}`)
}
</script>
