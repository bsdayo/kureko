<template>
  <div class="relative">
    <!-- <div v-if="headings.length > 0" class="font-bold mb-2">目录</div> -->
    <ul v-if="headings.length > 0" class="text-sm/6 border-l-2 mb-4">
      <li
        v-for="heading in headings"
        :key="heading.text"
        class="ml-2 transition-colors"
        :class="heading.id === activeHeading?.id ? 'text-foreground' : 'text-muted-foreground'"
      >
        <a
          :href="heading.href"
          :style="'padding-left: ' + Math.max(0, heading.level - 2) * 0.5 + 'em'"
        >
          {{ heading.text }}
        </a>
      </li>
    </ul>
    <span
      class="absolute top-0 left-0 text-sm/6 border-l-2 border-primary transition-[transform,opacity]"
      :style="
        `transform: translateY(${(activeHeading?.index || 0) * 100}%);` +
        `opacity: ${activeHeading ? 1 : 0};`
      "
    >
      &nbsp;
    </span>

    <div
      class="text-muted-foreground text-sm flex items-center gap-1 cursor-pointer select-none"
      @click="scrollToTop"
    >
      <ArrowUp class="size-4" />
      <span>回到顶部</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type DocumentType, type NodeType, type TextType } from '@tiptap/core'
import { useWindowScroll } from '@vueuse/core'
import { ArrowUp } from 'lucide-vue-next'

type HeadingType = NodeType<'heading', { level: number }, any, TextType[]>
interface Heading {
  id: string
  level: number
  text: string
  href: string
  index: number
  position: number
}

const props = defineProps<{
  content?: DocumentType
}>()

const headings = computed<Heading[]>(() => {
  if (!props.content) return []
  nextTick(calcHeadingPositions)
  return (props.content.content as NodeType[])
    .filter((node) => node.type === 'heading' && node.content)
    .map((node: HeadingType, index) => {
      const text = node
        .content!.filter((n) => n.type === 'text')
        .map((n) => n.text)
        .join('')
      const id = encodeURIComponent(text)
      return {
        id,
        level: node.attrs.level,
        text,
        href: '#' + id,
        index,
        position: 0,
      }
    })
})

function calcHeadingPositions() {
  for (const item of headings.value) {
    const element = document.getElementById(item.id)
    if (element) {
      item.position = element.getBoundingClientRect().top + window.scrollY
    }
  }
}

onMounted(() => {
  window.addEventListener('resize', calcHeadingPositions)
})
onUnmounted(() => {
  window.removeEventListener('resize', calcHeadingPositions)
})

const activeHeading = ref<Heading>()
const { y } = useWindowScroll()
watch(
  () => y.value,
  (newY) => {
    const rank = headings.value
      .map((heading) => ({ heading, diff: newY - heading.position }))
      .filter(({ diff }) => diff >= 0)
      .sort((a, b) => a.diff - b.diff)
    if (rank.length > 0) activeHeading.value = rank[0].heading
    else activeHeading.value = undefined
  }
)

function scrollToTop() {
  window.scrollTo(0, 0)
}
</script>
