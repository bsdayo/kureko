<template>
  <Dialog @update:open="refresh">
    <DialogTrigger as-child>
      <Button variant="secondary" size="icon">
        <Braces />
        <!-- <span>Inspect</span> -->
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>JSON</DialogTitle>
      </DialogHeader>

      <pre class="overflow-scroll h-[500px]"><code>{{ json }}</code></pre>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'
import { Braces } from 'lucide-vue-next'

const props = defineProps<{
  editor?: Editor
}>()

const json = ref('')

function refresh(open: boolean) {
  if (!open) {
    return
  }
  if (!props.editor) {
    json.value = ''
    return
  }
  json.value = JSON.stringify(props.editor.getJSON(), null, 2)
}
</script>
