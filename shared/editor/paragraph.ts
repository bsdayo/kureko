import Paragraph from '@tiptap/extension-paragraph'

export const DeletableParagraph = Paragraph.extend({
  addKeyboardShortcuts() {
    return {
      'Shift-Backspace': () => {
        if (
          !this.editor.isActive(this.name) ||
          this.editor.state.selection.$anchor.node().content.size !== 0
        ) {
          return false
        }
        return this.editor.commands.deleteNode(this.name)
      },
    }
  },
})
