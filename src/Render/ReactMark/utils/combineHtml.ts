import {IRenderNode} from '@/Render/ReactMark/Renderer'

export const combineHtml = (nodes: IRenderNode[]) => {
  let filterNodes:IRenderNode[] = []
  let currentNode:IRenderNode | null = null
  for (let n of nodes) {
    if (n.type === 'html') {
      if (!currentNode) {
        currentNode = n
        filterNodes.push(n)
      } else {
        currentNode.value += n.value
      }
    } else if (n.type === 'text') {
      if (currentNode) {
        currentNode.value += n.value
      } else {
        filterNodes.push(n)
      }
    } else {
      currentNode = null
      filterNodes.push(n)
    }
  }
  return filterNodes
}
