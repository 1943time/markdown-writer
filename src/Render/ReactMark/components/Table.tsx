import {IRenderNode, ReactRenderer} from '@/Render/ReactMark/Renderer'
import {getPosAttr} from '@/Render/ReactMark/utils'

const toTh = (nodes: IRenderNode[]) => {
  for (let n of nodes[0]?.children) {
    if (n.type === 'tableCell') n.type = 'th'
  }
}

const setAlign = (nodes: IRenderNode[], align: string[]) => {
  nodes = nodes || []
  for (let i = 0; i < nodes.length; i++) {
    if (align[i]) {
      const n = nodes[i]
      if (!n.attributes) n.attributes = {}
      n.attributes.style = {textAlign: align[i]}
    }
  }
}

export function Table({node}: {
  node: IRenderNode
}) {
  if (!node.children?.length) return null
  const head = node.children.slice(0, 1)
  toTh(head)
  setAlign(head[0]?.children, node.align)
  setAlign(node.children.slice(1)[0]?.children, node.align)
  return (
    <table {...getPosAttr(node)}>
      <thead>
        <ReactRenderer nodes={head}/>
      </thead>
      <tbody>
      <ReactRenderer nodes={node.children.slice(1)}/>
      </tbody>
    </table>
  )
}
