import {useEffect} from 'react'
import {stateStore} from '@/store/state'
import {EditorUtils} from '@/Editor/method'

const findClosestMap = (el: HTMLElement) => {
  let map = [0, 0]
  while(el) {
    if (el.parentElement) {
      if (el.parentElement.dataset.sourceLine) {
        map = [Number(el.parentElement.dataset.sourceLine), Number(el.parentElement.dataset.sourceLineEnd)]
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

export function useCheckbox(pdf: boolean) {
  if (pdf) return
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const el = e.target as HTMLInputElement
      if (el.classList.contains('task-list-item-checkbox')) {
        let [start, end] = findClosestMap(el) || []
        start = start + 1
        if (start && end && stateStore.editor) {
          const model = stateStore.editor.getModel()!
          let text = model.getValueInRange({
            startColumn: 0,
            endColumn: model.getLineMaxColumn(end),
            endLineNumber: end,
            startLineNumber: start
          })
          text = text.replace(/- \[[\sx]]/, m => {
            return `- [${el.checked ? 'x' : ' '}]`
          })
          EditorUtils.setRange(stateStore.editor!, {
            start: {line: start, column: 0}, end: {line: end, column: model.getLineMaxColumn(end)}
          }, text)
        }
      }
    }
    const box = document.querySelector('#doc-container') as HTMLDivElement
    box?.addEventListener('click', click)
    return () => box?.removeEventListener('click', click)
  }, [])
}
