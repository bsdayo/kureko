import { findParentNode, mergeAttributes, Node } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    figure: {
      setFigure: () => ReturnType
      unsetFigure: () => ReturnType
    }
  }
}

export const Figcaption = Node.create({
  name: 'figcaption',
  content: 'text*',
  isolating: true,
  parseHTML() {
    return [{ tag: 'figcaption' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['figcaption', mergeAttributes(HTMLAttributes), 0]
  },
})

export const Figure = Node.create({
  name: 'figure',
  group: 'block',
  content: 'block figcaption',
  isolating: true,

  addCommands() {
    return {
      setFigure:
        () =>
        ({ state, chain }) => {
          const { schema, selection } = state
          const { $from, $to } = selection
          const range = $from.blockRange($to)
          if (!range) return false

          const slice = state.doc.slice(range.start, range.end)
          const match = schema.nodes.figure.contentMatch.matchFragment(slice.content)
          if (!match) return false

          const content = slice.toJSON().content || []

          return chain()
            .insertContentAt(
              { from: range.start, to: range.end },
              {
                type: this.name,
                content: [
                  ...content,
                  {
                    type: 'figcaption',
                  },
                ],
              }
            )
            .run()
        },
      unsetFigure:
        () =>
        ({ state, chain }) => {
          const { selection } = state
          const figure = findParentNode((node) => node.type.name === this.name)(selection)
          if (!figure) return false

          const block = figure.node.content.firstChild
          const range = { from: figure.pos, to: figure.pos + figure.node.nodeSize }

          return chain().insertContentAt(range, block).run()
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        const { schema, selection } = this.editor.state
        const { empty, $anchor } = selection

        // When figcaption is empty, deleete the figure node
        if (
          !empty ||
          $anchor.parent.type !== schema.nodes.figcaption ||
          $anchor.parent.textContent.trim()
        ) {
          return false
        }

        return this.editor.commands.unsetFigure()
      },
    }
  },

  parseHTML() {
    return [{ tag: 'figure' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['figure', { ...HTMLAttributes }, 0]
  },
})
