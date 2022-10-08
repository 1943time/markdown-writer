import {useLayoutEffect, useMemo, useRef} from 'react'
import MarkdownIt from 'markdown-it'
// @ts-ignore
import taskPlugin from 'markdown-it-task-lists'
// @ts-ignore
import {html5Media} from 'markdown-it-html5-media'
import {useCopy} from '@/Render/utils/copy-code'
import {containerPlugin} from '@/Render/plugins/container'
import emojiPlugin from 'markdown-it-emoji'
import {preWrapperPlugin} from '@/Render/plugins/preWrapper'
import anchorPlugin from 'markdown-it-anchor'
import {slugify} from '@/Render/plugins/suglfy'
import {linkPlugin} from '@/Render/plugins/link'
import {useLink} from '@/Render/utils/useLink'
import {mediaPlugin} from '@/Render/plugins/media'
import {useCheckbox} from '@/Render/utils/useCheckbox'
import {highlight} from '@/Render/utils/highlight'
import {usePreview} from '@/Render/utils/usePreview'

export const useMd = (pdf = false) => {
  useCopy(pdf)
  useLink(pdf)
  useCheckbox(pdf)
  usePreview(pdf)
  return useMemo(() => {
    const md = MarkdownIt({
      highlight: (str, lang) => {
        return highlight(str, lang)
      }
    })
    md
      .use(taskPlugin, {enabled: true, label:true})
      .use(containerPlugin)
      .use(emojiPlugin)
      .use(preWrapperPlugin)
      .use(
        anchorPlugin,
        {
          slugify,
          permalink: anchorPlugin.permalink.ariaHidden({}),
        } as anchorPlugin.AnchorOptions)
      .use(
        linkPlugin,
        {
          target: '_blank',
          rel: 'noreferrer'
        },
        pdf
      )
      .use(html5Media, {
        videoAttrs: 'controls class="mx-auto"',
        audioAttrs: 'controls class="mx-auto"'
      })
      .use(mediaPlugin, pdf)
    return md
  }, [])
}
