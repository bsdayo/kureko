import { findChildren } from '@tiptap/core'
import { Plugin, PluginKey, type PluginView } from '@tiptap/pm/state'
import { Node as ProsemirrorNode } from '@tiptap/pm/model'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

import catppuccinLatte from 'shiki/themes/catppuccin-latte.mjs'
import catppuccinMocha from 'shiki/themes/catppuccin-mocha.mjs'
import CodeBlock from '@tiptap/extension-code-block'

/** Create code decorations for the current document */
function getDecorations({ doc, name }: { doc: ProsemirrorNode; name: string }) {
  const decorations: Decoration[] = []

  const codeBlocks = findChildren(doc, (node) => node.type.name === name)

  codeBlocks.forEach((block) => {
    let from = block.pos + 1
    let language = block.node.attrs.language

    if (!highlighter) return

    if (!highlighter.getLoadedLanguages().includes(language)) {
      language = 'text'
    }

    const tokens = highlighter.codeToTokensWithThemes(block.node.textContent, {
      lang: language,
      themes: shikiThemes,
    })

    decorations.push(
      Decoration.node(block.pos, block.pos + block.node.nodeSize, {
        style:
          `color:${catppuccinLatte.colors?.['editor.foreground']};` +
          `background-color:${catppuccinLatte.colors?.['editor.background']};` +
          `--shiki-dark:${catppuccinMocha.colors?.['editor.foreground']};` +
          `--shiki-dark-bg:${catppuccinMocha.colors?.['editor.background']};`,
      })
    )

    for (const line of tokens) {
      for (const token of line) {
        const to = from + token.content.length

        const decoration = Decoration.inline(from, to, {
          style: `color:${token.variants.light.color};--shiki-dark:${token.variants.dark.color};`,
        })

        decorations.push(decoration)

        from = to
      }

      from += 1
    }
  })

  return DecorationSet.create(doc, decorations)
}

async function loadLanguagesFromPM({ doc, name }: { doc: ProsemirrorNode; name: string }) {
  const codeBlocks = findChildren(doc, (node) => node.type.name === name)
  const languages = codeBlocks.map((block) => block.node.attrs.language as string | undefined)
  await Promise.all(languages.map((language) => loadHighlighterLanguage(language)))
}

function ShikiProseMirrorPlugin({ name }: { name: string }) {
  const shikiPlugin: Plugin<any> = new Plugin({
    key: new PluginKey('shiki'),

    view(view) {
      // This small view is just for initial async handling
      class ShikiPluginView implements PluginView {
        constructor() {
          this.initDecorations()
        }

        update() {
          this.checkUndecoratedBlocks()
        }
        destroy() {}

        // Initialize shiki async, and then highlight initial document
        async initDecorations() {
          const doc = view.state.doc
          await loadLanguagesFromPM({ doc, name })
          const tr = view.state.tr.setMeta('shikiPluginForceDecoration', true)
          view.dispatch(tr)
        }

        // When new codeblocks were added and they have missing themes or
        // languages, load those and then add code decorations once again.
        async checkUndecoratedBlocks() {
          const codeBlocks = findChildren(view.state.doc, (node) => node.type.name === name)

          // Load missing themes or languages when necessary.
          // loadStates is an array with booleans depending on if a theme/lang
          // got loaded.
          const loadStates = await Promise.all(
            codeBlocks.flatMap((block) => [loadHighlighterLanguage(block.node.attrs.language)])
          )
          const didLoadSomething = loadStates.includes(true)

          // The asynchronous nature of this is potentially prone to
          // race conditions. Imma just hope it's fine lol

          if (didLoadSomething) {
            const tr = view.state.tr.setMeta('shikiPluginForceDecoration', true)
            view.dispatch(tr)
          }
        }
      }

      return new ShikiPluginView()
    },

    state: {
      init: (_, { doc }) => {
        return getDecorations({
          doc,
          name,
        })
      },
      apply: (transaction, decorationSet, oldState, newState) => {
        const oldNodeName = oldState.selection.$head.parent.type.name
        const newNodeName = newState.selection.$head.parent.type.name
        const oldNodes = findChildren(oldState.doc, (node) => node.type.name === name)
        const newNodes = findChildren(newState.doc, (node) => node.type.name === name)

        const didChangeSomeCodeBlock =
          transaction.docChanged &&
          // Apply decorations if:
          // selection includes named node,
          ([oldNodeName, newNodeName].includes(name) ||
            // OR transaction adds/removes named node,
            newNodes.length !== oldNodes.length ||
            // OR transaction has changes that completely encapsulte a node
            // (for example, a transaction that affects the entire document).
            // Such transactions can happen during collab syncing via y-prosemirror, for example.
            transaction.steps.some((step) => {
              // @ts-ignore
              return (
                // @ts-ignore
                step.from !== undefined &&
                // @ts-ignore
                step.to !== undefined &&
                oldNodes.some((node) => {
                  // @ts-ignore
                  return (
                    // @ts-ignore
                    node.pos >= step.from &&
                    // @ts-ignore
                    node.pos + node.node.nodeSize <= step.to
                  )
                })
              )
            }))

        // only create code decoration when it's necessary to do so
        if (transaction.getMeta('shikiPluginForceDecoration') || didChangeSomeCodeBlock) {
          return getDecorations({
            doc: transaction.doc,
            name,
          })
        }

        return decorationSet.map(transaction.mapping, transaction.doc)
      },
    },

    props: {
      decorations(state) {
        return shikiPlugin.getState(state)
      },
    },
  })

  return shikiPlugin
}

export const CodeBlockShiki = CodeBlock.extend({
  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      ShikiProseMirrorPlugin({
        name: this.name,
      }),
    ]
  },
}).configure({
  HTMLAttributes: {
    class: 'shiki',
  },
})
