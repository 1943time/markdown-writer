import {useEffect} from 'react'
import {stateStore} from '@/store/state'
import {EditorUtils} from '@/Editor/method'

const findClosestMap = (el: HTMLElement) => {
  let map = [0, 0]
  while(el) {
    if (el.parentElement) {
      if (el.parentElement.dataset.startLine) {
        map = [Number(el.parentElement.dataset.startLine), Number(el.parentElement.dataset.endLine)]
        break
      } else {
        el = el.parentElement
      }
    } else {
      break
    }
  }
  return map
}

export function useCheckbox(readonly?: boolean) {
  useEffect(() => {
    if (readonly) return
    const click = (e: MouseEvent) => {
      const el = e.target as HTMLInputElement
      if (el.type === 'checkbox') {
        let [start, end] = findClosestMap(el) || []
        if (start && end && stateStore.editor) {
          const model = stateStore.editor.getModel()!
          let text = model.getValueInRange({
            startColumn: 0,
            endColumn: model.getLineMaxColumn(end),
            endLineNumber: end,
            startLineNumber: start
          })
          text = text.replace(/ \[[\sx]]/, m => {
            return ` [${el.checked ? 'x' : ' '}]`
          })
          EditorUtils.setRange(stateStore.editor!, {
            start: {line: start, column: 0}, end: {line: end, column: model.getLineMaxColumn(end)}
          }, text)
          setTimeout(() => {
            stateStore.renderNow$.next(stateStore.editor!.getModel()?.getValue()!)
          })
        }
      }
    }
    const box = document.querySelector('#doc-container') as HTMLDivElement
    box?.addEventListener('click', click)
    return () => box?.removeEventListener('click', click)
  }, [])
}
