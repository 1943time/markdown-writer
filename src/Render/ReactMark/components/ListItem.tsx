import {IRenderNode, ReactRenderer} from '@/Render/ReactMark/Renderer'
import {getPosAttr} from '@/Render/ReactMark/utils'

export function ListItem({node}: {
  node: IRenderNode
}) {
  return (
    <li {...getPosAttr(node)}>
      {typeof node.checked === 'boolean' &&
        <span className={'pr-2'}>
          <input type={'checkbox'} checked={node.checked} readOnly={true}/>
        </span>
      }
      <ReactRenderer nodes={node.children}/>
    </li>
  )
}
