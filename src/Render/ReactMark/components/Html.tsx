import {IRenderNode} from '@/Render/ReactMark/Renderer'
import {getPosAttr} from '@/Render/ReactMark/utils'

export function Html({node}: {
  node: IRenderNode
}) {
  return <span dangerouslySetInnerHTML={{__html: node.value}} {...getPosAttr(node)}/>
}
