import {IRenderNode, ReactRenderer} from '../Renderer'
import {getPosAttr} from '@/Render/ReactMark/utils'
const types = ['info', 'tip', 'warning', 'danger', 'details']
export function Container({node}: {
  node: IRenderNode
}) {
  const name = node.name.toLowerCase()
  let labelNode:IRenderNode | null = null
  for (let i = 0; i < node.children.length; i++) {
    if (node.children[i].data?.directiveLabel) {
      labelNode = node.children[i]
      node.children.splice(i, 1)
    }
  }
  if (name === 'details') {
    return (
      <details className="details custom-block" {...getPosAttr(node)}>
        <summary>{labelNode?.children[0]?.value || node.name}</summary>
        <ReactRenderer nodes={node.children}/>
      </details>
    )
  }
  return (
    <div className={`${types.includes(name) ? node.name : 'info'} custom-block`} {...getPosAttr(node)}>
      <p className="m-0 font-semibold">{labelNode?.children[0]?.value || node.name}</p>
      <ReactRenderer nodes={node.children}/>
    </div>
  )
}
