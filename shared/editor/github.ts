import { mergeAttributes, Node } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    github: {
      insertGitHubUser: (username: string) => ReturnType
    }
  }
}

export const GitHubUser = Node.create({
  name: 'githubUser',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: false,
  draggable: true,

  addAttributes() {
    return {
      username: {
        parseHTML: (element) => element.getAttribute('data-username') || '',
        renderHTML(attributes) {
          return {
            'data-username': attributes.username,
          }
        },
      },
    }
  },

  parseHTML() {
    return [{ tag: `span.github-user` }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        class: 'github-user',
        style: `--avatar: url('https://avatars.githubusercontent.com/${node.attrs.username}')`,
      }),
      [
        'a',
        {
          href: `https://github.com/${node.attrs.username}`,
          target: '_blank',
        },
        '@' + node.attrs.username,
      ],
    ]
  },

  addCommands() {
    return {
      insertGitHubUser:
        (username) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: { username },
            })
            .run()
        },
    }
  },
})
