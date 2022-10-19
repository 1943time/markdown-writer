import {IRenderNode, ReactRenderer} from '@/Render/ReactMark/Renderer'
import {getPosAttr} from '@/Render/ReactMark/utils'

export function Paragraph({node}: {
  node: IRenderNode
}) {
  return (
    <div {...getPosAttr(node)} className={'p'}>
      <ReactRenderer nodes={node.children}/>
    </div>
  )
}
