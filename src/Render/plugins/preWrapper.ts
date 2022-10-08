import MarkdownIt from 'markdown-it'

export const preWrapperPlugin = (md: MarkdownIt) => {
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]
    const lang = tokens[idx].info
    const index = token.attrGet('data-index')
    token.attrSet('data-index', '')
    const rawCode = fence(...args)
    return `<div class="language-${lang}" data-index="${index}"><button class="copy"></button><span class="lang">${lang}</span>${rawCode}</div>`
  }
}
