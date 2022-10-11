import {IRenderNode, ReactRenderer} from '@/Render/ReactMark/Renderer'
import {getPosAttr} from '@/Render/ReactMark/utils'

export function Link({node}: {
  node: IRenderNode
}) {
  return (
    <a {...getPosAttr(node)} href={node.url}>
      <ReactRenderer nodes={node.children}/>
    </a>
  )
}
