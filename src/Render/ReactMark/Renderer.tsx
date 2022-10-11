import {Heading} from '@/Render/ReactMark/components/Heading'
import {createElement, FunctionComponent} from 'react'
import {getPosAttr} from '@/Render/ReactMark/utils'
import {Container} from '@/Render/ReactMark/components/Container'
import {Code} from '@/Render/ReactMark/components/Code'
import {Link} from '@/Render/ReactMark/components/Link'
import {Media} from '@/Render/ReactMark/components/Media'
import {ListItem} from '@/Render/ReactMark/components/ListItem'
import {Table} from '@/Render/ReactMark/components/Table'
import {Katex} from '@/Render/ReactMark/components/Katex/Katex'

export type IRenderNode = {
  type: string
  attributes?: Record<string, any>
  position: {start: {line: number, column: number, offset: number}, end: {line: number, column: number, offset: number}}
  children: IRenderNode[]
  [key: string]: any
}
const tagMap:Record<string, any> = {
  'paragraph': 'p',
  'list': (node: IRenderNode) => {
    return node.ordered ? 'ol' : 'ul'
  },
  'inlineCode': 'code',
  'delete': 'del',
  'tableRow': 'tr',
  'tableCell': 'td',
  'emphasis': 'i',
  'thematicBreak': 'hr'
}
export function ReactRenderer({nodes}: {
  nodes: IRenderNode[]
}) {
  if (!nodes?.length) return null
  return (
    <>
      {nodes.map((n, i) =>
        <RenderNode node={n} key={i}/>
      )}
    </>
  )
}

function RenderNode({node}: {
  node: IRenderNode
}) {
  switch (node.type) {
    case 'heading':
      return createElement(Heading, {node})
    case 'containerDirective':
      return createElement(Container, {node})
    case 'code':
      return createElement(Code, {node})
    case 'break':
      return createElement('br')
    case 'text':
      return node.value
    case 'textDirective':
      return node.name
    case 'link':
      return createElement(Link, {node})
    case 'image':
      return createElement(Media, {node})
    case 'table':
      return createElement(Table, {node})
    case 'listItem':
      return createElement(ListItem, {node})
    case 'math':
      return createElement(Katex, {node})
    case 'inlineMath':
      return createElement(Katex, {node})
    default:
      let map = tagMap[node.type]
      if (map instanceof Function) map = map(node)
      let child:any = node.value
      if (node.children?.length) {
        child = createElement(ReactRenderer, {
          nodes: node.children
        })
      }
      return createElement(map || node.type, {
        ...getPosAttr(node),
        ...node.attributes
      }, child)
  }
}
