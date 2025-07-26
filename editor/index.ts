import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Image from '@tiptap/extension-image'
import Emoji, { gitHubEmojis } from '@tiptap/extension-emoji'
import { Details, DetailsSummary, DetailsContent } from '@tiptap/extension-details'
import { TableKit } from '@tiptap/extension-table'

import { HeadingWithAnchor } from './heading'
import { CodeBlockShiki } from './codeblock'
import { Figure, Figcaption } from './figure'
import { Alert, AlertContent, AlertTitle } from './alert'
import { GitHubUser } from './github'

export function contentEditorExtensions() {
  return [
    Placeholder.configure({
      placeholder: '写点什么……',
    }),
    CharacterCount,
    StarterKit.configure({
      heading: false,
      codeBlock: false,
      link: false,
    }),
    HeadingWithAnchor.configure({
      levels: [2, 3, 4, 5, 6],
    }),
    CodeBlockShiki,
    Link.extend({ inclusive: false }).configure({ openOnClick: false }),
    Subscript,
    Superscript,
    Image,
    Emoji.configure({ emojis: gitHubEmojis }),
    TableKit,
    Figure,
    Figcaption,
    // Details,
    // DetailsSummary,
    // DetailsContent,
    Alert,
    AlertTitle,
    AlertContent,
    GitHubUser,
  ]
}

export function commentEditorExtensions({ placeholder }: { placeholder: string }) {
  return [
    Placeholder.configure({ placeholder }),
    CharacterCount.configure({
      limit: COMMENT_CHARACTER_LIMIT,
    }),
    StarterKit.configure({
      heading: false,
      codeBlock: false,
      link: false,
    }),
    CodeBlockShiki,
    Link.extend({ inclusive: false }).configure({ openOnClick: false }),
    Subscript,
    Superscript,
    Emoji.configure({ emojis: gitHubEmojis }),
    TableKit,
    GitHubUser,
  ]
}
