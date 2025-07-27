<template>
  <Dialog @update:open="(open) => open && updateImageUrls()">
    <DialogTrigger as-child>
      <Button>
        <Library />
        <span>图库</span>
      </Button>
    </DialogTrigger>

    <DialogContent class="max-w-3xl">
      <DialogHeader>
        <DialogTitle>图库</DialogTitle>
        <DialogDescription>选择或上传图片</DialogDescription>
      </DialogHeader>

      <ScrollArea class="max-h-[60vh]">
        <div class="grid grid-cols-2 gap-4 justify-items-center">
          <Button
            size="content"
            variant="ghost"
            v-for="imageUrl in imageUrls"
            :key="imageUrl"
            @click="() => emit('insert', imageUrl)"
          >
            <img :src="imageUrl" class="h-32" />
          </Button>
        </div>
      </ScrollArea>

      <DialogFooter>
        <Button @click="uploadImage">
          <Upload />
          <span>上传</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { Library, Upload } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const { draftId } = defineProps<{
  draftId?: string
}>()

const emit = defineEmits<{
  (e: 'insert', url: string): void
}>()

const imageUrls = ref<string[]>([])
async function updateImageUrls() {
  if (!draftId) return

  const draft = await pb.collection('drafts').getOne(draftId, {
    expand: 'images',
  })
  console.log(draft)
  if (!draft.expand?.images) {
    imageUrls.value = []
    return
  }

  imageUrls.value = draft.expand.images.map((image: Image) => pb.files.getURL(image, image.file))
}

const pb = usePocketBase()

function uploadImage() {
  if (!draftId) return

  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = true
  input.onchange = async (event) => {
    const files = (event.target as HTMLInputElement).files
    if (!files) return

    const imageIds: string[] = []
    await Promise.all(
      Array.from(files).map(async (file) => {
        const image = await pb.collection('images').create({ file })
        imageIds.push(image.id)
      })
    )

    if (imageIds.length !== files.length) {
      toast.error(`部分图片上传失败！已上传：${imageIds.length}，总图片：${files.length}`)
    }

    // https://pocketbase.io/docs/working-with-relations/#prependappend-to-multiple-relation
    await pb.collection('drafts').update(draftId, {
      'images+': imageIds,
    })

    toast.success(`成功上传 ${imageIds.length} 张图片。`)

    await updateImageUrls()
  }

  input.click()
}
</script>

<style></style>
