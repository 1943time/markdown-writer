import {IRenderNode, ReactRenderer} from '../Renderer'
import {getPosAttr} from '@/Render/ReactMark/utils'
const types = ['info', 'tip', 'warning', 'danger', 'details']
export function Container({node}: {
  node: IRenderNode
}) {
  const name = node.name.toLowerCase()
  if (name === 'details') {
    return (
      <details className="details custom-block" {...getPosAttr(node)}>
        <summary>{node.attributes?.id || node.name}</summary>
        <ReactRenderer nodes={node.children}/>
      </details>
    )
  }
  return (
    <div className={`${types.includes(name) ? node.name : 'info'} custom-block`} {...getPosAttr(node)}>
      <p className="m-0 font-semibold">{node.attributes?.id || node.name}</p>
      <ReactRenderer nodes={node.children}/>
    </div>
  )
}
