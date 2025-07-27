import { findParentNode, mergeAttributes, Node } from '@tiptap/core'

// From Material for MkDocs: Admonitions
type AlertType =
  | 'note'
  | 'abstract'
  | 'info'
  | 'tip'
  | 'success'
  | 'question'
  | 'warning'
  | 'failure'
  | 'danger'
  | 'bug'
  | 'example'
  | 'quote'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    alert: {
      toggleAlert: (type: AlertType) => ReturnType
      setAlert: (type: AlertType) => ReturnType
      unsetAlert: () => ReturnType
    }
  }
}

export const AlertTitle = Node.create({
  name: 'alertTitle',
  content: 'text*',
  isolating: true,
  parseHTML() {
    return [{ tag: 'div.alert-title' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'alert-title' }), 0]
  },
})

export const AlertContent = Node.create({
  name: 'alertContent',
  content: 'block*',
  isolating: false,
  parseHTML() {
    return [{ tag: 'div.alert-content' }]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { class: 'alert-content prose prose-sm dark:prose-invert' }),
      0,
    ]
  },
})

export const Alert = Node.create({
  name: 'alert',
  group: 'block',
  content: 'alertTitle alertContent?',
  isolating: true,

  addAttributes() {
    return {
      type: {
        default: 'info',
        parseHTML: (element) => element.getAttribute('data-type') || 'info',
        renderHTML(attributes) {
          return {
            'data-type': attributes.type || 'info',
          }
        },
      },
    }
  },

  addCommands() {
    return {
      toggleAlert:
        (type) =>
        ({ editor, chain }) => {
          if (editor.isActive(this.name, { type })) {
            return chain().unsetAlert().run()
          } else {
            return chain().setAlert(type).run()
          }
        },

      setAlert:
        (type) =>
        ({ state, chain }) => {
          const { schema, selection } = state
          const alert = findParentNode((node) => node.type.name === this.name)(selection)

          if (alert) {
            return chain().updateAttributes(this.name, { type }).run()
          } else {
            const { $from, $to } = selection
            const range = $from.blockRange($to)
            if (!range) return false

            const slice = state.doc.slice(range.start, range.end)
            const match = schema.nodes.alertContent?.contentMatch.matchFragment(slice.content)
            if (!match) return false

            const content = slice.toJSON().content || []

            return chain()
              .insertContentAt(
                { from: range.start, to: range.end },
                {
                  type: this.name,
                  attrs: { type },
                  content: [{ type: 'alertTitle' }, { type: 'alertContent', content }],
                }
              )
              .run()
          }
        },
      unsetAlert:
        () =>
        ({ state, chain }) => {
          const { selection } = state
          const alert = findParentNode((node) => node.type.name === this.name)(selection)
          if (!alert) return false

          const alertTitle = alert.node.firstChild
          const alertContent = alert.node.lastChild
          const range = { from: alert.pos, to: alert.pos + alert.node.nodeSize }

          const content = []

          if (alertTitle && alertTitle.textContent.trim()) {
            const alertParent = state.doc.resolve(alert.pos).parent
            const defaultType = alertParent.type.contentMatch.defaultType
            if (defaultType?.contentMatch.matchFragment(alertTitle.content)) {
              const newTitleNode = defaultType.create(null, alertTitle.content)
              content.push(newTitleNode.toJSON())
            }
          }
          if (alertContent) {
            content.push(...(alertContent.content.toJSON() ?? []))
          }

          return chain().insertContentAt(range, content).run()
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        const { schema, selection } = this.editor.state
        const { empty, $anchor } = selection

        // When alertTitle is empty, delete the alert node
        if (
          !empty ||
          $anchor.parent.type !== schema.nodes.alertTitle ||
          $anchor.parent.textContent.trim()
        ) {
          return false
        }

        return this.editor.commands.unsetAlert()
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div.alert' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'alert' }), 0]
  },
})
