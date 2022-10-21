import {IRenderNode, ReactRenderer} from '@/Render/ReactMark/Renderer'
import {getPosAttr} from '@/Render/ReactMark/utils'
import {treeStore} from '@/store/tree'
import {useMemo} from 'react'
import {mediaType} from '@/utils/mediaType'
import {readFileSync} from 'fs'
import {parser} from '@/Render/ReactMark/utils/parser'
export function Directive({node}: {
  node: IRenderNode
}) {
  const nodes = useMemo(() => {
    const path = node.children[0]?.value
    if (path) {
      const target = treeStore.findNodeByPath(path)
      if (target && target.type === 'file' && mediaType(target.name) === 'markdown') {
        const code = readFileSync(target.path, {encoding: 'utf-8'})
        return parser.parse(code || '').children as IRenderNode[]
      }
      return null
    }
    return null
  }, [node.children[0]?.value])
  if (nodes) return <ReactRenderer nodes={nodes}/>
  return null
}
