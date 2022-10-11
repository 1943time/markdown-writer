import {IRenderNode} from '@/Render/ReactMark/Renderer'

export const getPosAttr = (node: IRenderNode) => {
  return {
    ['data-start-line']: node.position?.start.line,
    ['data-end-line']: node.position?.end.line
  }
}
