import mediumZoom from 'medium-zoom'

export async function postprocessContent() {
  // Highlight with shiki
  const highlighter = await getOrCreateHighlighter()

  for (const codeBlockEl of document.querySelectorAll('pre > code[class*=language-]')) {
    const pre = codeBlockEl.parentElement
    if (!pre) continue

    const language = codeBlockEl.className.replace('language-', '')
    await loadHighlighterLanguage(language)
    const html = highlighter.codeToHtml(codeBlockEl.textContent || '', {
      lang: language,
      themes: {
        light: 'catppuccin-latte',
        dark: 'catppuccin-mocha',
      },
    })

    pre.insertAdjacentHTML('afterend', html)
    pre.remove()
  }

  // Add labels to images
  for (const figure of document.querySelectorAll('figure')) {
    const img = figure.querySelector('img')
    const caption = figure.querySelector('figcaption')
    if (!img || !caption) continue
    img.setAttribute('alt', caption.textContent || '')
  }
  mediumZoom('.prose img', {
    background: 'rgba(0, 0, 0, 0.5)',
  })

  // Scroll to anchor
  const route = useRoute()
  if (!route.hash) return
  const element = document.getElementById(encodeURIComponent(route.hash.slice(1)))
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
