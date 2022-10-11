import {useRef} from 'react'
import {useSetState} from 'react-use'
import {useSubject} from '@/utils/hooks'
import {stateStore} from '@/store/state'
import {scrollByLine} from '@/Render/utils/scrollByLine'
import {configStore} from '@/store/config'

export const useEditorChange = () => {
  const [state, setState] = useSetState({
    code: ''
  })
  let timer = useRef(0)
  useSubject(stateStore.renderNow$, code => {
    setState({code})
  })
  useSubject(stateStore.editor$, editor => {
    editor.onDidChangeModelContent((e) => {
      clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        const value = editor.getValue()
        setState({code: value})
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
  return state.code
}
