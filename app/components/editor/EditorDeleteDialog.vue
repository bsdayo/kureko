<template>
  <AlertDialog @update:open="() => (slugInput = '')">
    <AlertDialogTrigger as-child>
      <Button variant="destructive" size="icon">
        <Trash />
        <!-- <span>删除</span> -->
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>删除</AlertDialogTitle>
        <AlertDialogDescription>确认删除此草稿吗？此操作无法撤销。</AlertDialogDescription>
      </AlertDialogHeader>

      <div v-if="slug" class="text-sm">
        输入
        <code class="bg-muted rounded px-[0.3rem] py-[0.2rem] font-mono text-xs">
          {{ slug }}
        </code>
        以确认。
      </div>
      <Input v-if="slug" class="font-mono" v-model="slugInput" />

      <AlertDialogFooter>
        <AlertDialogCancel>取消</AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          :disabled="slug && slug !== slugInput"
          @click="deleteDraft"
        >
          删除
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script lang="ts" setup>
import { Trash } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const props = defineProps<{
  draftId: string
  slug?: string
}>()

const pb = usePocketBase()
const slugInput = ref('')

async function deleteDraft() {
  await pb.collection('drafts').delete(props.draftId)
  toast.success('草稿已删除。')
  await navigateTo('/')
}
</script>
