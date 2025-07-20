<template>
  <div :class="['flex', 'gap-2', wrap ? 'flex-wrap' : 'flex-nowrap']">
    <ToggleGroup type="multiple" variant="outline">
      <ToggleGroupItem
        value="bold"
        :data-state="toState(editor?.isActive('bold'))"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="italic"
        :data-state="toState(editor?.isActive('italic'))"
        @click="editor?.chain().focus().toggleItalic().run()"
      >
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="underline"
        :data-state="toState(editor?.isActive('underline'))"
        @click="editor?.chain().focus().toggleUnderline().run()"
      >
        <Underline />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="strike"
        :data-state="toState(editor?.isActive('strike'))"
        @click="editor?.chain().focus().toggleStrike().run()"
      >
        <Strikethrough />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="code"
        :data-state="toState(editor?.isActive('code'))"
        @click="editor?.chain().focus().toggleCode().run()"
      >
        <Code />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="subscript"
        :data-state="toState(editor?.isActive('subscript'))"
        @click="editor?.chain().focus().toggleSubscript().run()"
      >
        <Subscript />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="superscript"
        :data-state="toState(editor?.isActive('superscript'))"
        @click="editor?.chain().focus().toggleSuperscript().run()"
      >
        <Superscript />
      </ToggleGroupItem>
    </ToggleGroup>

    <ToggleGroup type="multiple" variant="outline" v-if="mode === 'full'">
      <!-- <ToggleGroupItem
        value="h1"
        :data-state="toState(editor?.isActive('heading', { level: 1 }))"
        @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        <Heading1 />
      </ToggleGroupItem> -->
      <ToggleGroupItem
        value="h2"
        :data-state="toState(editor?.isActive('heading', { level: 2 }))"
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        <Heading2 />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="h3"
        :data-state="toState(editor?.isActive('heading', { level: 3 }))"
        @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        <Heading3 />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="h4"
        :data-state="toState(editor?.isActive('heading', { level: 4 }))"
        @click="editor?.chain().focus().toggleHeading({ level: 4 }).run()"
      >
        <Heading4 />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="h5"
        :data-state="toState(editor?.isActive('heading', { level: 5 }))"
        @click="editor?.chain().focus().toggleHeading({ level: 5 }).run()"
      >
        <Heading5 />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="h6"
        :data-state="toState(editor?.isActive('heading', { level: 6 }))"
        @click="editor?.chain().focus().toggleHeading({ level: 6 }).run()"
      >
        <Heading6 />
      </ToggleGroupItem>
    </ToggleGroup>

    <ToggleGroup type="multiple" variant="outline">
      <ToggleGroupItem
        value="paragraph"
        v-if="mode === 'full'"
        :data-state="toState(editor?.isActive('paragraph'))"
        @click="toggleParagraph"
      >
        <Text />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="blockquote"
        :data-state="toState(editor?.isActive('blockquote'))"
        @click="editor?.chain().focus().toggleBlockquote().run()"
      >
        <Quote />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="figure"
        v-if="mode === 'full'"
        :data-state="toState(editor?.isActive('figure'))"
        @click="editor?.chain().focus().setFigure().run()"
      >
        <Captions />
      </ToggleGroupItem>
      <!-- <ToggleGroupItem
        value="details"
        :data-state="toState(editor?.isActive('details'))"
        @click="editor?.chain().focus().setDetails().run()"
      >
        <ListCollapse />
      </ToggleGroupItem> -->
    </ToggleGroup>

    <ToggleGroup type="multiple" variant="outline">
      <Popover v-model:open="linkPopoverOpen">
        <PopoverTrigger as-child>
          <ToggleGroupItem value="link" :data-state="toState(editor?.isActive('link'))">
            <Link />
          </ToggleGroupItem>
        </PopoverTrigger>
        <PopoverContent class="flex flex-col gap-2">
          <Input v-model="linkTextInput" placeholder="文本" />
          <div class="flex gap-2">
            <Input v-model="linkUrlInput" placeholder="链接" />
            <Button @click="setLink" size="icon">
              <Check />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Popover v-model:open="codeBlockPopoverOpen">
        <PopoverTrigger as-child>
          <ToggleGroupItem value="codeBlock" :data-state="toState(editor?.isActive('codeBlock'))">
            <FileCode />
          </ToggleGroupItem>
        </PopoverTrigger>
        <PopoverContent class="flex gap-2">
          <Input v-model="codeBlockLangInput" placeholder="代码语言" />
          <Button @click="setCodeBlock" size="icon" :disabled="!codeBlockLangInput">
            <Check />
          </Button>
        </PopoverContent>
      </Popover>
      <Popover v-model:open="imagePopoverOpen" v-if="mode === 'full'">
        <PopoverTrigger as-child>
          <ToggleGroupItem value="image" :data-state="toState(editor?.isActive('image'))">
            <Image />
          </ToggleGroupItem>
        </PopoverTrigger>
        <PopoverContent class="flex flex-col gap-2">
          <Input v-model="imageLinkInput" placeholder="图片链接" />
          <div class="flex gap-2">
            <Input v-model="imageWidthInput" placeholder="宽" />
            <Input v-model="imageHeightInput" placeholder="高" />
            <Button @click="() => setImage()" size="icon" :disabled="!imageLinkInput">
              <Check />
            </Button>
          </div>
          <EditorGalleryDialog :draft-id="draftId" @insert="(url) => setImage(url)" />
        </PopoverContent>
      </Popover>
    </ToggleGroup>

    <ToggleGroup type="multiple" variant="outline" v-if="mode === 'full'">
      <ToggleGroupItem
        value="alertInfo"
        :data-state="toState(editor?.isActive('alert', { type: 'info' }))"
        @click="editor?.chain().focus().toggleAlert('info').run()"
      >
        <Info />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="alertWarn"
        :data-state="toState(editor?.isActive('alert', { type: 'warn' }))"
        @click="editor?.chain().focus().toggleAlert('warn').run()"
      >
        <TriangleAlert />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="alertError"
        :data-state="toState(editor?.isActive('alert', { type: 'error' }))"
        @click="editor?.chain().focus().toggleAlert('error').run()"
      >
        <Ban />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="alertSuccess"
        :data-state="toState(editor?.isActive('alert', { type: 'success' }))"
        @click="editor?.chain().focus().toggleAlert('success').run()"
      >
        <CircleCheck />
      </ToggleGroupItem>
    </ToggleGroup>
  </div>
</template>

<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Subscript,
  Superscript,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Link,
  FileCode,
  Image,
  Check,
  Captions,
  Quote,
  Info,
  TriangleAlert,
  Ban,
  CircleCheck,
  Text,
} from 'lucide-vue-next'

const { editor } = defineProps<{
  editor?: Editor
  mode: 'full' | 'comment'
  draftId?: string
  wrap?: boolean
}>()

function toState(val?: boolean): 'on' | 'off' {
  return val ? 'on' : 'off'
}

function toggleParagraph() {
  if (editor?.isActive('paragraph') && editor?.state.selection.$from.node().content.size === 0) {
    editor.chain().focus().deleteNode('paragraph').run()
  } else {
    editor?.chain().focus().setParagraph().run()
  }
}

// Link
const linkTextInput = ref('')
const linkUrlInput = ref('')
const linkPopoverOpen = ref(false)
watch(linkPopoverOpen, (open) => {
  if (!open || !editor) return
  if (editor.isActive('link')) {
    const anchor = editor.state.selection.$anchor
    linkTextInput.value = anchor.parent.maybeChild(anchor.index())?.text || ''
    linkUrlInput.value = editor.getAttributes('link').href || ''
  } else {
    linkTextInput.value = ''
    linkUrlInput.value = ''
  }
})
function setLink() {
  if (!linkUrlInput.value.trim()) {
    editor?.chain().focus().unsetLink().run()
    linkPopoverOpen.value = false
    return
  }

  const isRelativeUrl =
    new URL(linkUrlInput.value, document.baseURI).origin === new URL(document.baseURI).origin
  const target = isRelativeUrl ? '_self' : '_blank'
  const content = {
    type: 'text',
    marks: [
      {
        type: 'link',
        attrs: {
          href: linkUrlInput.value,
          target,
        },
      },
    ],
    text: linkTextInput.value || linkUrlInput.value,
  }

  editor
    ?.chain()
    .focus()
    .command(({ state, chain, editor }) => {
      if (editor.isActive('link')) {
        const { $anchor } = state.selection
        const from = $anchor.pos - $anchor.textOffset
        const link = state.doc.nodeAt(from)
        console.log('found link node', link)
        if (!link) return false
        return chain()
          .insertContentAt({ from, to: from + link.nodeSize }, content)
          .run()
      } else {
        return chain().insertContent(content).run()
      }
    })
    .run()
  linkPopoverOpen.value = false
}

// Code Block
const codeBlockLangInput = ref('')
const codeBlockPopoverOpen = ref(false)
watch(codeBlockPopoverOpen, (open) => {
  if (!open) return
  const previousLang = editor?.getAttributes('codeBlock').language
  codeBlockLangInput.value = previousLang || ''
})
function setCodeBlock() {
  editor?.chain().focus().setCodeBlock({ language: codeBlockLangInput.value }).run()
  codeBlockPopoverOpen.value = false
}

// Image
const imageLinkInput = ref('')
const imageWidthInput = ref('')
const imageHeightInput = ref('')
const imagePopoverOpen = ref(false)
watch(imagePopoverOpen, (open) => {
  if (!open) return
  const selectedImage = editor?.$nodes('image')?.filter((node) => {
    return node.from === editor?.state.selection.from && node.to === editor?.state.selection.to
  })[0]
  imageLinkInput.value = selectedImage ? selectedImage.attributes['src'] : ''
  imageWidthInput.value = selectedImage ? selectedImage.attributes['width'] : ''
  imageHeightInput.value = selectedImage ? selectedImage.attributes['height'] : ''
})
function setImage(url?: string) {
  const src = url ?? imageLinkInput.value
  editor
    ?.chain()
    .focus()
    .setImage({
      src,
      width: Number(imageWidthInput.value) || undefined,
      height: Number(imageHeightInput.value) || undefined,
    })
    .run()
  imagePopoverOpen.value = false
}
</script>
