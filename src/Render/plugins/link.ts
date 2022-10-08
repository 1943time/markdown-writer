import MarkdownIt from 'markdown-it'
export const linkPlugin = (
  md: MarkdownIt,
  externalAttrs: Record<string, string>,
  pdf: boolean
) => {
  md.renderer.rules.link_open = (
    tokens,
    idx,
    options,
    env: any,
    self
  ) => {
    const token = tokens[idx]
    const hrefIndex = token.attrIndex('href')
    if (hrefIndex >= 0) {
      const hrefAttr = token.attrs![hrefIndex]
      const url = hrefAttr[1]
      if((/^(https?:)?\/\//i).test(url)) {
        Object.entries(externalAttrs).forEach(([key, val]) => {
          token.attrSet(key, val)
        })
      } else if (pdf && !url.startsWith('#')) {
        token.attrSet('href', '')
      }
    }
    return self.renderToken(tokens, idx, options)
  }
}
