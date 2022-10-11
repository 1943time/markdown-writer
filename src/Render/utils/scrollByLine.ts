export const scrollByLine = () => {
  const lineNodes = (document.querySelector('.margin-view-overlays')?.children || []) as HTMLDivElement[]
  if (!lineNodes.length) return
  const relateTopNode = Array.from(lineNodes).filter(n => !!n.children.length).reduce((a, b) => {
    return a.offsetTop > b.offsetTop ? b : a
  })
  const line = +relateTopNode.innerText
  const offsetLinePercent = (62 - relateTopNode.getBoundingClientRect().top) / relateTopNode.clientHeight
  let currentNode: HTMLElement | null = null
  let outside = false
  const topNodes= document.querySelector('#render')!.children || []
  for (let n of topNodes) {
    const [start, end] = [Number((<HTMLElement>n).dataset.startLine), Number((<HTMLElement>n).dataset.endLine)]
    if (start) {
      if (line < start) {
        currentNode = n as HTMLElement
        outside = true
        break
      }
      if (line >= start && line <= end) {
        currentNode = n as HTMLElement
        outside = false
        break
      }
    }
  }
  if (currentNode) {
    const [start, end] = [Number(currentNode.dataset.startLine), Number(currentNode.dataset.endLine) + 1]
    const offsetLinePx = currentNode.clientHeight / (end - start) * offsetLinePercent
    if (!outside) {
      const move = currentNode.offsetTop + currentNode.clientHeight * ((line - start) / (end - start)) + offsetLinePx
      document.querySelector('#doc-container')!.scroll({top: move - 20})
    } else {
      document.querySelector('#doc-container')!.scroll({top: currentNode.offsetTop - 20})
    }
  }
}
