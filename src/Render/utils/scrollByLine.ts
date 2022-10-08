import Token from 'markdown-it/lib/token'
import {stateStore} from '@/store/state'
export const scrollByLine = () => {
  const lineNodes = (document.querySelector('.margin-view-overlays')?.children || []) as HTMLDivElement[]
  if (!lineNodes.length) return
  const relateTopNode = Array.from(lineNodes).filter(n => !!n.children.length).reduce((a, b) => {
    return a.offsetTop > b.offsetTop ? b : a
  })
  const line = +relateTopNode.innerText
  const offsetLinePercent = (62 - relateTopNode.getBoundingClientRect().top) / relateTopNode.clientHeight
  let index: number = 0
  let currentToken: Token | null = null
  let outside = false
  for (let i = 0; i < stateStore.topTokens.length; i++) {
    const token = stateStore.topTokens[i]
    if (line <= token.map![1]) {
      index = i + 1
      currentToken = token
      outside = line <= token.map![0]
      break
    }
  }
  if (currentToken) {
    const targetEl = (document.querySelector(`[data-index="${index}"]`) as HTMLElement)
    const [start, end] = currentToken.map!
    const offsetLinePx = targetEl.clientHeight / (end - start) * offsetLinePercent
    if (!outside) {
      const move = targetEl.offsetTop + targetEl.clientHeight * ((line - start - 1) / (end - start)) + offsetLinePx
      document.querySelector('#doc-container')!.scroll({top: move - 20})
    } else {
      document.querySelector('#doc-container')!.scroll({top: targetEl.offsetTop - 20})
    }
  }
}
