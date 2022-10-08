import {useCallback, useRef} from 'react'
import {useSetState} from 'react-use'
import MarkdownIt from 'markdown-it'
import {useSubject} from '@/utils/hooks'
import {stateStore} from '@/store/state'
import {scrollByLine} from '@/Render/utils/scrollByLine'
import {configStore} from '@/store/config'
import {highlight} from '@/Render/utils/highlight'
export const useEditorChange = (md: MarkdownIt) => {
  const [state, setState] = useSetState({
    htmlStr: ''
  })
  let timer = useRef(0)
  const renderer = useCallback((code: string) => {
    stateStore.currentCode = code
    const tokens = md.parse(code, {})
    const topTokens = tokens.filter(t => {
      if (t.nesting !== -1) {
        t.attrPush(['data-source-line', String(t.map?.[0])])
        t.attrPush(['data-source-line-end', String(t.map?.[1])])
      }
      return t.level === 0 && t.block && t.nesting !== -1
    })
    topTokens.map((t, i) => {
      t.attrPush(['data-index', String(i + 1)])
      return t
    })
    stateStore.setTopTokens(topTokens)
    const htmlStr = md.renderer.render(tokens, {
      html: true,
      linkify: true,
      highlight: (str, lang) => {
        return highlight(str, lang)
      }
    }, {})
    setState({htmlStr})
  }, [])
  useSubject(stateStore.renderNow$, code => {
    renderer(code)
  })
  useSubject(stateStore.editor$, editor => {
    editor.onDidChangeModelContent((e) => {
      clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        const value = editor.getValue()
        renderer(value)
      }, stateStore.viewState === 'code' ? 2000 : 300)
    })
    let scrollTimer = 0
    editor.onDidScrollChange(e => {
      if (configStore.render_syncScroll) {
        if (configStore.render_smooth) {
          clearTimeout(scrollTimer)
          scrollTimer = window.setTimeout(() => {
            scrollByLine()
          }, 30)
        } else {
          scrollByLine()
        }
      }
    })
  })
  return state.htmlStr
}
