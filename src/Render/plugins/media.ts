import MarkdownIt from 'markdown-it'
import {treeStore} from '@/store/tree'
import {getUrl} from '@/utils/dom'
import Token from 'markdown-it/lib/token'
import Renderer, {RenderRule} from 'markdown-it/lib/renderer'
import {printParams} from '@/Render/PdfRender'

export const mediaPlugin = (
  md: MarkdownIt,
  pdf: boolean
) => {
  const audioRule = md.renderer.rules.audio!
  const videoRule = md.renderer.rules.video!
  const imageRule = md.renderer.rules.image!
  const fn = (rule: RenderRule) => (tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer) => {
    const token = tokens[idx]
    let url = token.attrGet('src')
    if (url) {
      url = decodeURIComponent(url)
      if (/^https?:\/\//.test(url)) {
        token.attrSet('src', decodeURIComponent(url))
      } else if (!url.startsWith('#')) {
        let targetPath:string | null = null
        if (pdf) {
          targetPath = treeStore.getAbsolutePath(printParams.path, url, printParams.root)
        } else {
          targetPath = treeStore.getAbsolutePath(treeStore.activePath || '', url)
        }
        if (targetPath) {
          token.attrSet('src', getUrl(targetPath))
          token.attrSet('alt', '')
        }
      }
    }
    return rule(tokens, idx, options, env, self)
  }
  md.renderer.rules.audio = fn(audioRule)
  md.renderer.rules.video = fn(videoRule)
  md.renderer.rules.image = fn(imageRule)
}
