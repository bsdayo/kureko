import { mergeAttributes } from '@tiptap/core'
import Heading from '@tiptap/extension-heading'

export const HeadingWithAnchor = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level)
    const level = hasLevel ? node.attrs.level : this.options.levels[0]
    const id = encodeURIComponent(node.textContent)

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ['span', { id, class: 'heading-anchor' }, ''],
      ['span', 0],
      ['a', { href: `#${id}`, target: '_self', class: 'heading-anchor-link' }, ' #'],
    ]
  },
})
