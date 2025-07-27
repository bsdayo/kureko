<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button>
        <Upload />
        <span>{{ verb }}</span>
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ verb }}</AlertDialogTitle>
        <AlertDialogDescription>确认{{ verb }}此{{ noun }}吗？</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>取消</AlertDialogCancel>
        <AlertDialogAction @click="execute">{{ verb }}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script lang="ts" setup>
import { Upload } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const pb = usePocketBase()

const props = defineProps<{
  baseId?: string
  draftId: string
  draftType: string
}>()

const noun = computed(() => (props.draftType === 'home' ? '主页' : '文章'))
const verb = computed(() => (props.baseId ? '更新' : '发布'))

async function execute() {
  const draft = await pb.collection('drafts').getOne(props.draftId)
  const data = {
    type: draft.type,
    title: draft.title,
    slug: draft.slug,
    content: draft.content,
    images: draft.images,
  }

  const content = props.baseId
    ? await pb.collection('contents').update(props.baseId, data)
    : await pb.collection('contents').create(data)

  await pb.collection('drafts').delete(props.draftId)

  toast.success(`${noun.value}已${verb.value}。`)
  await navigateTo(props.draftType === 'home' ? '/' : `/posts/${content.slug}`)
}
</script>
