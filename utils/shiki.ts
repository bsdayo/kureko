/**
Original code: https://github.com/timomeh/tiptap-extension-code-block-shiki
Modified for integration & personal preferences.


MIT License

Copyright (c) 2024, Timo Mämecke

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import {
  bundledLanguages,
  createHighlighterCore,
  type HighlighterCore,
  type BundledLanguage,
} from 'shiki'

import catppuccinLatte from 'shiki/themes/catppuccin-latte.mjs'
import catppuccinMocha from 'shiki/themes/catppuccin-mocha.mjs'
import { createJavaScriptRegexEngine } from 'shiki/engine-javascript.mjs'

export let highlighter: HighlighterCore | undefined
let highlighterPromise: Promise<HighlighterCore> | undefined
const loadingLanguages = new Set<string>()

export const shikiThemes = {
  light: 'catppuccin-latte',
  dark: 'catppuccin-mocha',
}

/**
 * Load the highlighter. Makes sure the highlighter is only loaded once.
 */
export function getOrCreateHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [catppuccinLatte, catppuccinMocha],
      langs: [],
      engine: createJavaScriptRegexEngine(),
    }).then((hl) => {
      highlighter = hl
      return hl
    })
  }
  return highlighterPromise
}

/**
 * Loads a language if it's valid and not yet loaded
 * @returns true or false depending on if it got loaded.
 */
export async function loadHighlighterLanguage(language: string | undefined) {
  const highlighter = await getOrCreateHighlighter()

  if (!language) return false
  if (highlighter.getLoadedLanguages().includes(language)) return false
  if (loadingLanguages.has(language)) return false

  const importFn = bundledLanguages[language as BundledLanguage]
  if (!importFn) return false

  loadingLanguages.add(language)
  await highlighter.loadLanguage(await importFn())
  loadingLanguages.delete(language)

  return true
}
